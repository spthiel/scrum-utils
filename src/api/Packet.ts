export default abstract class Packet {
    protected filled = false;

    construct(data?: Uint8Array) {
        if (!data) {
            return;
        }
        this.deserialize(data);
        this.filled = true;
    }

    serialize(): Uint8Array {
        if (!this.filled) {
            throw new Error("Trying to serialize empty package");
        }
        return this.internalSerialize();
    }

    abstract deserialize(data: Uint8Array): void;

    protected abstract internalSerialize(): Uint8Array;
}
