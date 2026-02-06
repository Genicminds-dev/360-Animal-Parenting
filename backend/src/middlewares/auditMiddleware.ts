import { Request, Response, NextFunction } from "express";

export const setAudit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (req.method === "POST") {
            req.body.createdBy = userId;
            req.body.updatedBy = userId;
        } else if (req.method === "PUT" || req.method === "PATCH") {
            req.body.updatedBy = userId;
            delete req.body.createdBy;
        }

        next();
    } catch (err) {
        console.error("Audit Middleware Error:", err);
        next();
    }
};
