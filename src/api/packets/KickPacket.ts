import Packet from "api:Packet";

export default class KickPacket extends Packet {
    constructor(data?: Uint8Array) {
        super();
        this.construct(data);
    }

    static from(): KickPacket {
        const packet = new KickPacket();

        packet.filled = true;

        return packet;
    }

    deserialize(): void {}

    protected internalSerialize(): Uint8Array {
        return new Uint8Array();
    }
}
