import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../types/index.js";
import createHttpError from "http-errors";

export const canAccess = (roles:string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const _req = req as AuthRequest;
    const roleFromToken = _req?.auth?.role as string;
    if (!roles.includes(roleFromToken)) {
      next(createHttpError(403, "you dont have permission"));
      return;
    }
    next();
  };
};
