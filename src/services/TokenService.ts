import fs from "fs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import path from "path";
import { AuthService } from "../constants/index.js";

export default class TokenService {
  generateAccessToken(payload:JwtPayload) {
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
}
