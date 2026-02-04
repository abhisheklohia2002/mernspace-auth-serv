
import { type NextFunction, type Response } from "express";
import type { RegisterRequestBody } from "../types/index.js";
import type { UserService } from "../services/userService.js";
import type { Logger } from "winston";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path";
import { validationResult } from "express-validator";
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private logger: Logger,
  ) {}
  async register(req: RegisterRequestBody, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({error:result.array()});
    }
    const { firstName, lastName, email, role } = req.body;
    if (!email) {
      const error = createHttpError(400, "Email is required");
      next(error);
      return;
    }
    this.logger.debug("New Request to register a user", {
      firstName,
      lastName,
      email,
      role,
    });
    try {
      const privateKey = fs.readFileSync(path.join(__dirname,"../../certs/private.pem"))
      const user = await this.userService.createUser(req.body);
      this.logger.info(`User has been Registerd`, { user });
      const payload = {
        email
      }
      const accessToken = jwt.sign(payload,privateKey,{
        algorithm:'RS256',
        expiresIn:"1h",
        issuer:'auth-service',
       
      })
      const refreshToken = "dscsdsf"

      res.cookie("accessToken",accessToken,{
        domain:'localhost',
        sameSite:"strict",
        httpOnly:true,
        maxAge:1000 * 60 * 60
      })
       res.cookie("refreshToken",refreshToken,{
        domain:'localhost',
        sameSite:"strict",
        httpOnly:true,
        maxAge:1000 *  60 * 60 * 24 * 365
      })
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
      return;
    }
  }
}
