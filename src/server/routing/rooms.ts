import {Router} from "websocket-express";

import RoomManager from "server:logic/rooms/RoomManager";

const router = new Router();

router.ws("/room/:roomId", async (req, res) => {
    const socket = await res.accept();

    RoomManager.join(req.params.roomId, socket);
});

router.get("/room/:roomId", (req, res) => {
    res.send("room");
});

export default router;
