import cookieParser from "cookie-parser";
import {WebSocketExpress} from "websocket-express";

import router from "server:routing/router";

const port = process.env.PORT || 3000;
const app = new WebSocketExpress();

app.use(cookieParser());

app.use(router);

const server = app.createServer();

server.listen(port, () => {
    console.log(`Server started on localhost:${port}`);
});
