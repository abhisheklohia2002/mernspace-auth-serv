import { type Request } from "express";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  tenantId?: number;
}
export interface RegisterRequestBody extends Request {
  body: UserData;
}

export interface AuthRequest extends Request {
  auth?: {
    sub: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
    iss?: string;
  };
}

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};
export interface IRefreshTokenPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jti: any;
  sub?: string;
  email?: string;
}
export interface RefreshTokenRequest extends Request {
  auth: {
    email: string;
    jti: string;
    sub?: string;
  };
}

export interface ITenant {
  name: string;
  address: string;
}

export interface CreateUserRequest extends Request {
  body: UserData;
}

export interface IValidateQuery {
  currentPage: number;
  perPage: number;
  q:string,
  role:string
}
