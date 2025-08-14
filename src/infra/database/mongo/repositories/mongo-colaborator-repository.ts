import { PaginationParams } from '@/common/interfaces/pagination-params';
import { ColaboratorRepository } from '@/core/application/repositories/colaborator-repository';
import { Colaborator } from '@/core/entities/colaborator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MongoColaboratorRepository implements ColaboratorRepository {
  constructor(
    @InjectModel('Colaborator')
    private readonly colaboratorModel: Model<Colaborator>,
  ) {}

  async create(colaborator: Colaborator): Promise<Colaborator> {
    const colaboratorDocument = await this.colaboratorModel.create({
      fullname: colaborator.fullname,
      birthdate: colaborator.birthdate,
      cpf: colaborator.cpf,
      role: colaborator.role,
      companyId: colaborator.companyId,
      createdAt: colaborator.createdAt ?? new Date(),
      updatedAt: colaborator.updatedAt ?? new Date(),
      deletedAt: colaborator.deletedAt ?? null,
    });

    return colaboratorDocument;
  }

  async findByCpf(cpf: string): Promise<Colaborator | null> {
    const colaborator = await this.colaboratorModel.findOne({ cpf });
    return colaborator;
  }

  async findById(id: string): Promise<Colaborator | null> {
    const colaborator = await this.colaboratorModel.findById(id);
    return colaborator;
  }

  async getAllByCompany(
    { page, itemsPerPage, search }: PaginationParams,
    companyId: string,
  ): Promise<Colaborator[]> {
    const filter: any = { companyId, deletedAt: null };

    if (search) {
      filter.$or = [{ fullname: { $regex: search, $options: 'i' } }];
    }

    const skip = (page - 1) * itemsPerPage;

    const colaborators = await this.colaboratorModel
      .find(filter)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 });

    return colaborators;
  }

  async toggleStatus(colaboratorId: string): Promise<void> {
    const colaborator = await this.colaboratorModel
      .findById(colaboratorId)
      .lean();

    if (!colaborator) {
      throw new Error('Colaborator not found');
    }

    const newStatus = colaborator.status === 'active' ? 'inactive' : 'active';

    await this.colaboratorModel.updateOne(
      { _id: colaboratorId },
      {
        $set: {
          status: newStatus,
          updatedAt: new Date(),
        },
      },
    );
  }

  async remove(colaboratorId: string): Promise<void> {
    await this.colaboratorModel.updateOne(
      { _id: colaboratorId },
      {
        $set: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );
  }
}
