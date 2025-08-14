import { Company } from '@/core/entities/company';
import { User } from '@/core/entities/user';

export abstract class UserRepository {
  abstract create(user: User, companyName?: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findCompany(userId: string): Promise<Company | null>;
  abstract getUserById(userId: string): Promise<User | null>;
}
