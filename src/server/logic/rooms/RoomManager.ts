import {type ExtendedWebSocket} from "websocket-express";

import Room from "server:logic/rooms/Room";

const rooms = new Map<string, Room>();

export default {
    join(room: string, websocket: ExtendedWebSocket) {
        if (!(room in rooms)) {
            rooms.set(room, new Room());
        }

        rooms.get(room)!.join(websocket);
    },
};
