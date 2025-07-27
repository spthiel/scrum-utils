import Room from "server:logic/rooms/Room";
import Client from "server:logic/sessions/Client";

const rooms = new Map<string, Room>();

export default {
    join(room: string, client: Client) {
        if (!(room in rooms)) {
            rooms.set(room, new Room());
        }

        rooms.get(room)!.join(client);
    },
};
