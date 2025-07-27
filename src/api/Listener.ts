import {Consumer} from "api:types";

export default class Listener<T> {
    private nextId = 0;
    private listeners = new Map<number, Consumer<T>>();

    constructor() {}

    broadcast(value: T) {
        this.listeners.values().forEach((listener) => listener(value));
    }

    addListener(listener: Consumer<T>) {
        const id = this.nextId++;
        this.listeners.set(id, listener);

        return id;
    }

    removeListener(id: number) {
        this.listeners.delete(id);
    }
}
