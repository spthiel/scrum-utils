import {Router} from "websocket-express";

import RoomManager from "server:logic/rooms/RoomManager";

const router = new Router();

router.ws("/room/:roomId", async (req, res) => {
    if (!req.session) {
        res.destroy(new Error("Invalid session."));
        return;
    }

    const socket = await res.accept();

    req.session.connectSocket(socket);
    RoomManager.join(req.params.roomId, req.session);
});

router.get("/room/:roomId", (req, res) => {
    res.send("room");
});

export default router;
