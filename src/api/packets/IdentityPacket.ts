import Encoding from "api:Encoding";
import Packet from "api:Packet";

export default class IdentityPacket extends Packet {
    private name?: string;
    private id?: string;

    constructor(data?: Uint8Array) {
        super();
        this.construct(data);
    }

    static from(name: string): IdentityPacket {
        const packet = new IdentityPacket();

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
        const separator = data.indexOf(0);
        this.name = Encoding.string.decode(data.slice(0, separator));
        this.id = Encoding.string.decode(data.slice(separator + 1));
    }

    protected internalSerialize(): Uint8Array {
        const name = Encoding.string.encode(this.name!);
        const id = Encoding.string.encode(this.id!);

        const out = new Uint8Array(name.length + id.length + 1);

        out.set(name);
        out.set(id, name.length + 1);

        return out;
    }
}
