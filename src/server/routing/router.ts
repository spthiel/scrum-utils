import {Router} from "websocket-express";

import index from "server:routing/index";
import Logging from "server:routing/middlewares/Logging";
import Session from "server:routing/middlewares/Session";
import rooms from "server:routing/rooms";

const router = new Router();

router.use(Logging);
router.use(Session);

router.use(rooms);
router.use(index);

export default router;
