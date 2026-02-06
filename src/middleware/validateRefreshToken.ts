/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expressjwt } from "express-jwt";
import { Config } from "../config/index.js";
import type { Request } from "express";
import type { AuthCookie, IRefreshTokenPayload } from "../types/index.js";
import { AppDataSource } from "../config/data-source.js";
import { RefreshToken } from "../entity/RefreshToken.js";
import logger from "../config/logger.js";

if (!Config.SECRET_KEY) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

export default expressjwt({
  secret: Config.SECRET_KEY,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookie;
    return refreshToken;
  },
  
  async isRevoked(req: Request, token) {
  try {
    const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);

    const payload = token?.payload as IRefreshTokenPayload;

    const jti = payload?.jti; // refresh token row id (from jwtid)
    const sub = payload?.sub; // user id (string)

    if (!jti) return true;

    const dbToken = await refreshTokenRepo.findOne({
      where: {
        id: Number(jti),
        ...(sub ? { userId: { id: Number(sub) } } : {}),
      },
      // relations not required for nested where, but ok if you want:
      // relations: { userId: true },
    });

    if (!dbToken) return true;

    // optional: DB expiry check
    if (dbToken.expiresAt && dbToken.expiresAt.getTime() < Date.now()) return true;

    return false; // ✅ not revoked
  } catch (error: unknown) {
    logger.error("refresh token revoke check failed", { error });
    return true;
  }
}


});
