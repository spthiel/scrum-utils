import {ExtendedWebSocket} from "websocket-express";

import Optional from "api:Optional";
import Packet from "api:Packet";
import packets from "api:packets/index";

const VERSION = 1;
const EXTRA_OFFSET = 2;

export default {
    send(websocket: ExtendedWebSocket, packet: Packet): void {
        const serialized = packet.serialize();

        const out = new Uint8Array(serialized.buffer, EXTRA_OFFSET);
        out[0] = VERSION;
        out[1] = packets.idOfPacket(packet);
        websocket.send(packet.serialize());
    },
    receive(data: Uint8Array): Optional<Packet> {
        const packetConstructor = packets.packets[data[1]];

        if (!packetConstructor) {
            console.warn(`A client attempted to send an invalid paket ${data[1]}`);
            return Optional.empty();
        }

        return Optional.of(new packetConstructor(data.slice(EXTRA_OFFSET)));
    },
};
