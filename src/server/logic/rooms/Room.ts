import Packet from "api:Packet";

import Client from "server:logic/sessions/Client";

export default class Room {
    private admin?: Client;
    private clients: Client[] = [];

    constructor() {}

    broadcast(packet: Packet) {
        for (const client of this.clients) {
            client.send(packet);
        }
    }

    join(client: Client) {
        if (this.clients.length === 0) {
            this.admin = client;
        }

        client.connectionListener.addListener((connected) => {
            // TODO: Set disconnect listener
        });
    }
}
