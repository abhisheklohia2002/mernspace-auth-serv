 
import { type NextFunction, type Response } from "express";
import type {
  AuthRequest,
  RefreshTokenRequest,
  RegisterRequestBody,
} from "../types/index.js";
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
       const data = { ...req.body };
    try {
      const user = await this.userService.createUser(data);
      this.logger.info(`User has been Registerd`, { user });
      const payload: JwtPayload = {
        email,
        sub: String(user.id),
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
      const isUserExisted = await this.userService.findByEmailWithPassword(req.body);
      const payload: JwtPayload = {
        email,
        sub: String(isUserExisted.id),
        role: isUserExisted.role,
      };
      const accessToken = this.tokenService.generateAccessToken(payload);
      const newRefeshToken =
        await this.tokenService.persistRefreshToken(isUserExisted);

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

  async self(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.sub;

      if (!userId) {
        return next(createHttpError(401, "Unauthorized"));
      }

      const user = await this.userService.findById(userId);

      if (!user) {
        return next(createHttpError(404, "User not found"));
      }

      return res.status(200).json({ user: user });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: RefreshTokenRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const auth = req.auth;

      const userId = auth?.sub;
      const email = auth?.email;
      const jti = auth?.jti;

      if (!userId || !jti) {
        throw createHttpError(401, "Invalid refresh token payload");
      }
      await this.tokenService.deleteRefreshToken(Number(jti));

      const user = await this.userService.findById(Number(userId));
      if (!user) throw createHttpError(404, "User not found");
      const payload: JwtPayload = {
        email,
        sub: String(user.id),
        role: user.role,
      };
      const accessToken = this.tokenService.generateAccessToken(payload);
      const newDbToken = await this.tokenService.persistRefreshToken(user);
      const newRefreshJwt = this.tokenService.generateRefreshToken(
        payload,
        String(newDbToken.id),
      );

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });

      res.cookie("refreshToken", newRefreshJwt, {
        domain: "localhost",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      return res.status(200).json({ message: "Token refreshed" });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: RefreshTokenRequest, res: Response, next: NextFunction) {
    try {
       const auth = req.auth;
      const userId = auth?.sub;
      const jti = auth?.jti;
      await this.tokenService.deleteRefreshToken(Number(jti));
      this.logger.info("user has been logout",{id:userId});
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({msg:'logout successfully'})
    } catch (error) {
      return next(error);
    }
  }
}
