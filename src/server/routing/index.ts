import {Router} from "websocket-express";

const router = new Router();

router.get("/", (req, res) => {
    res.send("Home");
});

router.get("*ignored", (req, res) => {
    res.redirect("/");
});

export default router;
