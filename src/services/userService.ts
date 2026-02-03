import type { Repository } from "typeorm";
import { User } from "../entity/User.js";
import type { UserData } from "../types/index.js";

export class UserService {
    constructor(private readonly userRepository:Repository<User>){

    }
  async createUser({ firstName, lastName, email, password }: UserData) {
    await this.userRepository.save({
      firstName,
      lastName,
      email,
      password,
    });
  }
}
