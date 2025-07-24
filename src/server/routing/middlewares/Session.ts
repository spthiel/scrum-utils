import type {NextFunction, Request, Response} from "express";

import Client from "server:logic/sessions/Client";
import SessionManager from "server:logic/sessions/SessionManager";

const SESSION_COOKIE_NAME = "OREO";

declare module "express-serve-static-core" {
    interface Request {
        session?: Client;
    }
}

export default function (req: Request, res: Response, next: NextFunction) {
    const currentSession = req.cookies[SESSION_COOKIE_NAME];

    let session: Client | undefined;

    if (currentSession) {
        const optional = SessionManager.getSession(currentSession);

        session = optional.orElse(undefined);
    }

    if (!session) {
        session = SessionManager.createSession();
        res.cookie(SESSION_COOKIE_NAME, session.getID(), {
            httpOnly: true,
            sameSite: "strict",
        });
    }

    req.session = session;

    next();
}
