import type {NextFunction, Request, Response} from "express";

import DateFormatter from "api:DateFormatter";

export default function (req: Request, res: Response, next: NextFunction) {
    console.log(`[${DateFormatter.formatDate()}] ${req.method} ${req.url}`);
    next();
}
