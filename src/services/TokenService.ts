import fs from "fs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import path from "path";
import { AuthService } from "../constants/index.js";
import { Config } from "../config/index.js";

export default class TokenService {
  generateAccessToken(payload: JwtPayload) {
    const privateKey = fs.readFileSync(
      path.join(__dirname, "../../certs/private.pem"),
    );
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: AuthService.AUTHSERVICE,
    });
    return accessToken;
  }

   generateRefreshToken(payload: JwtPayload,id:string) {
    // const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
    // const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    // const newRefeshToken = await refreshTokenRepository.save({
    //   user: user,
    //   expiresAt: new Date(Date.now() + MS_IN_YEAR),
    // });
    const refreshToken = jwt.sign(payload, Config.SECRET_KEY!, {
      algorithm: "HS256",
      expiresIn: "1yr",
      issuer: AuthService.AUTHSERVICE,
      jwtid: id,
    });
    return refreshToken;
  }
}
