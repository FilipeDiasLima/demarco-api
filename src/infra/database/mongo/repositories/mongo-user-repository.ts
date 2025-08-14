import { UserRepository } from '@/core/application/repositories/user-repository';
import { Company } from '@/core/entities/company';
import { User } from '@/core/entities/user';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User & Document>,
    @InjectModel('Company')
    private readonly companyModel: Model<Company & Document>,
  ) {}

  async create(user: User, companyName?: string): Promise<User> {
    const userDocument = (await this.userModel.create({
      fullname: user.fullname,
      email: user.email,
      cpf: user.cpf,
      role: user.role,
      password: user.password,
      isActive: user.isActive ?? true,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      deletedAt: user.deletedAt ?? null,
    })) as User & Document;

    if (companyName && user.role === 'admin') {
      await this.companyModel.create({
        name: companyName,
        owner: userDocument.id,
      });
    }

    return userDocument;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return await this.userModel.findOne({ cpf }).exec();
  }

  async findCompany(userId: string): Promise<Company | null> {
    const company = await this.companyModel.findOne({ owner: userId }).exec();
    return company ? company : null;
  }

  async getUserById(userId: string): Promise<User | null> {
    return await this.userModel.findById(userId).exec();
  }
}
