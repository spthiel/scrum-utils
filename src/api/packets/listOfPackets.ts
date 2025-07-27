import Packet from "api:Packet";
import IdentityPacket from "api:packets/IdentityPacket";
import KickPacket from "api:packets/KickPacket";

const packets = [IdentityPacket, KickPacket];

export default {
    packets,
    idOfPacket(packet: Packet): number {
        for (let i = 0; i < packets.length; i++) {
            const pack = packets[i];
            if (packet instanceof pack) {
                return i;
            }
        }

        throw new Error(`Trying to identify unknown packet ${packet}`);
    },
};
