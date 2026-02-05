 

import fs from "fs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import path from "path";
import { AuthService } from "../constants/index.js";
import { Config } from "../config/index.js";
import { RefreshToken } from "../entity/RefreshToken.js";
import type { User } from "../entity/User.js";
import type { Repository } from "typeorm";

export default class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

  generateAccessToken(payload: JwtPayload) {
    const privateKey = fs.readFileSync(
      path.join(__dirname, "../../certs/public.pem"),
    );
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: AuthService.AUTHSERVICE,
    });
    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload, id: string) {
    const refreshToken = jwt.sign(payload, Config.SECRET_KEY!, {
      algorithm: "HS256",
      expiresIn: "1yr",
      issuer: AuthService.AUTHSERVICE,
      jwtid: id,
    });
    return refreshToken;
  }

  async persistRefreshToken(user: User) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
    const newRefeshToken = await this.refreshTokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });
    return newRefeshToken;
  }
}
