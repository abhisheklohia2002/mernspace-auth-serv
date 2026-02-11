/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Repository } from "typeorm";
import { User } from "../entity/User.js";
import type { UserData } from "../types/index.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
interface loginUser {
  email: string;
  password: string;
}
export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}
  async hashPassword(password: string) {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
  }
  async comparePassword(dbPassword: string, password: string) {
    const isvalid = await bcrypt.compare(password, dbPassword);
    return isvalid;
  }

  async createUser({ firstName, lastName, email, password, role,tenantId }: UserData) {
    try {
      const isUserExist = await this.userRepository.findOne({
        where: { email },
      });
      if (isUserExist) {
        throw createHttpError(400, "Email already exists");
      }
     
      const user = await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: await this.hashPassword(password),
        role,
        ...(tenantId ? { tenant: { id: tenantId } } : {}),
      });
      return user;
    } catch (error: unknown) {
      if (createHttpError.isHttpError(error)) {
        throw error;
      }
      throw createHttpError(500, "Failed to store data into the database");
    }
  }

  async findByEmailWithPassword({ email, password }: loginUser) {
  const user = await this.userRepository.findOne({
    where: { email },
    select: ["id", "firstName", "lastName", "email", "role", "password"],
  });

  if (!user) {
    throw createHttpError(400, "invalid user");
  }

  const isPasswordValid = await this.comparePassword(user.password, password);
  if (!isPasswordValid) {
    throw createHttpError(404, "invalid credential");
  }

  const { password: _pw, ...safeUser } = user;
  return user;
}



  async loginUser({ email, password }: loginUser) {
    try {
      const isEmailPresent = await this.userRepository.findOne({
        where: { email },
      });
      if (!isEmailPresent) {
        throw createHttpError(400, "invalid user");
      }
      const isPasswordValid = await this.comparePassword(
        isEmailPresent.password,
        password,
      );
      if (!isPasswordValid) {
        throw createHttpError(404, "invalid credential");
      }
      return isEmailPresent;
    } catch (error: unknown) {
      if (createHttpError.isHttpError(error)) throw error;
      throw createHttpError(500, "Something went wrong");
    }
  }
  async findById(id:number){
    return await this.userRepository.findOne({
      where:{
        id
      },
      relations:{
        tenant:true
      }
    })
  }


  async getUsers(){
    return await this.userRepository.find({})
  }
  async getUserById(id:number){
    return await this.userRepository.findOneBy({id})
  }

  async updateUserById(id:number,body:UserData){
      const user = await this.userRepository.update(id,body);
      return user
  }

  async deleteUserById(id:number){
    return this.userRepository.delete(id)
  }

 
}
