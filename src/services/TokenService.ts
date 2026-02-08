/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AuthService } from "../constants/index.js";
import { Config } from "../config/index.js";
import { RefreshToken } from "../entity/RefreshToken.js";
import type { User } from "../entity/User.js";
import type { Repository } from "typeorm";
import createHttpError from "http-errors";

export default class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

  generateAccessToken(payload: JwtPayload) {
    if(!Config.PRIVATE_KEY){
      throw createHttpError(500,"PRIVATE_KEY missing")
    }
    const privateKey = Config.PRIVATE_KEY

    return jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: AuthService.AUTHSERVICE,
    });
  }

  generateRefreshToken(payload: JwtPayload, id: string) {
    return jwt.sign(payload, Config.SECRET_KEY!, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: AuthService.AUTHSERVICE,
      jwtid: id,
    });
  }

  async persistRefreshToken(user: User) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

    return this.refreshTokenRepository.save({
      userId: user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });
  }
   async deleteRefreshToken(id:number)
  {
    return await this.refreshTokenRepository.delete({id})
  }
}
