import {type ExtendedWebSocket} from "websocket-express";

import Packet from "api:Packet";
import Packets from "api:Packets";
import IdentityPacket from "api:packets/IdentityPacket";

interface ClientData {
    id: string;
    name: string;
}

export default class Room {
    private admin?: string;
    private clients = new Map<ExtendedWebSocket, Partial<ClientData>>();

    constructor() {}

    broadcast(packet: Packet, exclude?: ExtendedWebSocket) {
        for (const socket of this.clients.keys()) {
            if (socket === exclude) {
                continue;
            }

            Packets.send(socket, packet);
        }
    }

    join(websocket: ExtendedWebSocket) {
        const first = this.clients.size === 0 && !this.admin;

        this.clients.set(websocket, {});
        websocket.on("message", (message) => {
            // noinspection SuspiciousTypeOfGuard
            if (!(message instanceof Uint8Array)) {
                return;
            }

            const packet = Packets.receive(message);

            if (!packet.isPresent()) {
                return;
            }

            const paketData = packet.get();

            if (paketData instanceof IdentityPacket) {
                const data = this.clients.get(websocket)!;
                data.id = paketData.getId()!;
                data.name = paketData.getName()!;

                if (first) {
                    this.admin = data.id;
                    console.log(`Made ${data.id}:${data.name} admin of a room.`);
                }
            }
        });

        websocket.on("close", () => {
            this.clients.delete(websocket);
        });
    }
}
