import { UserRepository } from "../repository/userRepository";
import { User } from "@prisma/client";
import { CreateUserDto } from "../types/userTypes";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

    async findOrCreate(data: CreateUserDto): Promise<User> {
      let user = await this.findByEmail(data.email);
      if (!user) {
        user = await this.userRepository.create({
          email: data.email,
          name: data.name ?? data.email.split("@")[0],
        });
      }
      return user;
    }

  async update(id: string, data: Partial<Omit<User, "id">>): Promise<User> {
    return this.userRepository.update(id, data);
  }
}
