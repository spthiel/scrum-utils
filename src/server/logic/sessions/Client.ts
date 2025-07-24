import {ExtendedWebSocket} from "websocket-express";

export default class Client {
    private openSockets: ExtendedWebSocket[] = [];
    private lastConnect = Date.now();

    constructor(private clientID: string) {}

    public getID(): string {
        return this.clientID;
    }

    public connectSocket(socket: ExtendedWebSocket) {
        this.openSockets.push(socket);

        socket.on("close", () => {
            const index = this.openSockets.indexOf(socket);

            if (index === -1) {
                return;
            }

            this.openSockets.splice(index, 1);
        });
    }

    public lastTouchedBefore(timestamp: number): boolean {
        return timestamp > this.lastConnect;
    }

    public touch() {
        this.lastConnect = Date.now();
    }
}
