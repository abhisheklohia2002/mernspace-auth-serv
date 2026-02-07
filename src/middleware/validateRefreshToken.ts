/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expressjwt } from "express-jwt";
import { Config } from "../config/index.js";
import type { Request } from "express";
import type { AuthCookie, IRefreshTokenPayload } from "../types/index.js";
import  {AppDataSource}  from "../config/data-source.js";
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

    const jti = payload?.jti; 
    const sub = payload?.sub; 

    if (!jti) return true;

    const dbToken = await refreshTokenRepo.findOne({
      where: {
        id: Number(jti),
        ...(sub ? { userId: { id: Number(sub) } } : {}),
      },
    });

    if (!dbToken) return true;

    if (dbToken.expiresAt && dbToken.expiresAt.getTime() < Date.now()) return true;

    return false;
  } catch (error: unknown) {
    logger.error("refresh token revoke check failed", { error });
    return true;
  }
}


});
