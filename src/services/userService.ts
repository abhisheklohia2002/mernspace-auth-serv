import type { Repository } from "typeorm";
import { User } from "../entity/User.js";
import type { UserData } from "../types/index.js";
import createHttpError from "http-errors";

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}
  async createUser({ firstName, lastName, email, password }: UserData) {
    try {
      await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const err = createHttpError(
        500,
        `Failed to store data into the database`,
      );
      throw err;
    }
  }
}
