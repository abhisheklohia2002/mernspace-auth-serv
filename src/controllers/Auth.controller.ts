import { type NextFunction, type Response } from "express";
import type { RegisterRequestBody } from "../types/index.js";
import type { UserService } from "../services/userService.js";
import type { Logger } from "winston";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import type TokenService from "../services/TokenService.js";
import type { JwtPayload } from "jsonwebtoken";
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
  ) {}
  async register(req: RegisterRequestBody, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }
    const { firstName, lastName, email, role, password } = req.body;
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
      password,
    });
    try {
      const user = await this.userService.createUser(req.body);
      this.logger.info(`User has been Registerd`, { user });
      const payload: JwtPayload = {
        email,
        user: user.id,
        role: user.role,
      };
      const accessToken = this.tokenService.generateAccessToken(payload);

      const newRefeshToken = await this.tokenService.persistRefreshToken(user);
      const refreshToken = this.tokenService.generateRefreshToken(
        payload,
        String(newRefeshToken.id),
      );

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // one hour
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // one Year
      });
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
      return;
    }
  }

  async login(req: RegisterRequestBody, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const isUserExisted = await this.userService.loginUser(req.body);
      const payload: JwtPayload = {
        email,
        user: isUserExisted.id,
        role: isUserExisted.role,
      };
      const accessToken = this.tokenService.generateAccessToken(payload);

      const newRefeshToken = await this.tokenService.persistRefreshToken(isUserExisted);
      const refreshToken = this.tokenService.generateRefreshToken(
        payload,
        String(newRefeshToken.id),
      );
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // one hour
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // one Year
      });
      res.status(200).json({ message: "login successfully" });
    } catch (error: unknown) {
      return next(error);
      
    } 
  }
}
