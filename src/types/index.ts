import {type Request } from 'express';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role:string
}
export interface RegisterRequestBody extends Request {
  body: UserData;
}

export interface AuthRequest extends Request {
  auth :{
    id:string,
    role:number,

  }
}