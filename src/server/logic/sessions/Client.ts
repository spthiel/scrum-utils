import {ExtendedWebSocket} from "websocket-express";

import Listener from "api:Listener";
import Packet from "api:Packet";
import Packets from "api:Packets";
import IdentityPacket from "api:packets/IdentityPacket";

enum ConnectionTypes {
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    DESTROYED = "destroyed",
}

export default class Client {
    public readonly connectionListener = new Listener<ConnectionTypes>();
    public readonly messageListener = new Listener<Packet>();

    private openSockets: ExtendedWebSocket[] = [];
    private lastConnect = Date.now();

    private name: string = "Unidentified";

    constructor(private clientID: string) {}

    public getID(): string {
        return this.clientID;
    }

    public connectSocket(socket: ExtendedWebSocket) {
        if (this.openSockets.length === 0) {
            this.connectionListener.broadcast(ConnectionTypes.CONNECT);
        }
        this.openSockets.push(socket);

        socket.on("message", (data) => {
            // noinspection SuspiciousTypeOfGuard
            if (!(data instanceof Uint8Array)) {
                return;
            }

            const deserialized = Packets.deserialize(data);

            if (deserialized.isEmpty()) {
                return;
            }

            const packet = deserialized.get();

            if (packet instanceof IdentityPacket && packet.getName()) {
                this.name = packet.getName()!;
            }

            this.messageListener.broadcast(deserialized.get());
        });

        socket.on("close", () => {
            const index = this.openSockets.indexOf(socket);

            if (index === -1) {
                return;
            }

            this.openSockets.splice(index, 1);

            if (this.openSockets.length === 0) {
                this.connectionListener.broadcast(ConnectionTypes.DISCONNECT);
            }
        });
    }

    public send(packet: Packet | Uint8Array) {
        let data: Uint8Array;
        if (packet instanceof Packet) {
            data = Packets.serialize(packet);
        } else {
            data = packet;
        }

        for (const socket of this.openSockets) {
            socket.send(data);
        }
    }

    public lastTouchedBefore(timestamp: number): boolean {
        return timestamp > this.lastConnect;
    }

    public touch() {
        this.lastConnect = Date.now();
    }
}
