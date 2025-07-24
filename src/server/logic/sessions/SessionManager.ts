import Optional from "api:Optional";

import Client from "server:logic/sessions/Client";

const SESSION_TIMEOUT = 60 * 60 * 1000;
const CLEANUP_INTERVAL = 15 * 60 * 1000;

const sessions = new Map<string, Client>();

let lastId: number = 0;

function nextID(): string {
    let id = Date.now();

    if (lastId >= id) {
        id = lastId + 1;
    }

    lastId = id;

    return id.toString(16);
}

function createSession() {
    const clientID = nextID();
    const client = new Client(clientID);

    sessions.set(clientID, client);

    return client;
}

function getSession(clientID: string): Optional<Client> {
    const session = Optional.ofPossiblyEmpty(sessions.get(clientID));
    session.ifPresent((client) => client.touch());
    return session;
}

setInterval(() => {
    if (sessions.size === 0) {
        return;
    }
    console.log(`Starting cleanup tasks with ${sessions.size} sessions.`);
    let cleaned = 0;
    const outdated = Date.now() - SESSION_TIMEOUT;

    for (const key of sessions.keys()) {
        const session = sessions.get(key)!;

        if (session.lastTouchedBefore(outdated)) {
            sessions.delete(key);
            cleaned++;
        }
    }
    console.log(`Finished cleaning ${cleaned} sessions.`);
}, CLEANUP_INTERVAL);

export default {
    createSession,
    getSession,
};
