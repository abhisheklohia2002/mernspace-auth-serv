import type { Repository } from "typeorm";
import { User } from "../entity/User.js";
import type { UserData } from "../types/index.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}
  async hashPassword(password: string) {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
  }

  async createUser({ firstName, lastName, email, password, role }: UserData) {
    try {
      const isUserExist = await this.userRepository.findOne({
        where: { email },
      });
      if (isUserExist) {
        const error = createHttpError(400, "email is already existed");
        throw error;
      }
      await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: await this.hashPassword(password),
        role,
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
