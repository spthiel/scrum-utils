import Encoding from "api:Encoding";
import Packet from "api:Packet";

export default class RoomPacket extends Packet {
    private room = new Map();

    constructor(data?: Uint8Array) {
        super();
        this.construct(data);
    }

    static from(name: string): RoomPacket {
        const packet = new RoomPacket();

        packet.name = name;
        packet.filled = true;

        return packet;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    deserialize(data: Uint8Array): void {
        this.name = Encoding.string.decode(data);
    }

    protected internalSerialize(): Uint8Array {
        return Encoding.string.encode(this.name!);
    }
}
