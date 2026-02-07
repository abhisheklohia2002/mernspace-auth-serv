 
import { expressjwt } from "express-jwt";
import { Config } from "../config/index.js";
import type { Request } from "express";
import type { AuthCookie } from "../types/index.js";


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

});
