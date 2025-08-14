import { PaginationParams } from '@/common/interfaces/pagination-params';
import { MedicalCertificateRepository } from '@/core/application/repositories/medical-certificate-repository';
import { MedicalCertificate } from '@/core/entities/medical-certificate';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MongoMedicalCertificateRepository
  implements MedicalCertificateRepository
{
  constructor(
    @InjectModel('MedicalCertificate')
    private readonly medicalCertificateModel: Model<MedicalCertificate>,
  ) {}

  async create(
    medicalCertificate: MedicalCertificate,
  ): Promise<MedicalCertificate> {
    const medicalCertificateDocument =
      await this.medicalCertificateModel.create({
        collaboratorId: medicalCertificate.collaboratorId,
        certificateDateTime: medicalCertificate.certificateDateTime,
        leaveDays: medicalCertificate.leaveDays,
        companyId: medicalCertificate.companyId,
        cid: medicalCertificate.cid,
        notes: medicalCertificate.notes,
        createdAt: medicalCertificate.createdAt ?? new Date(),
        updatedAt: medicalCertificate.updatedAt ?? new Date(),
        deletedAt: medicalCertificate.deletedAt ?? null,
      });

    return medicalCertificateDocument;
  }

  async getAll(
    { page, itemsPerPage, search }: PaginationParams,
    companyId: string,
  ): Promise<MedicalCertificate[]> {
    const filter: any = { companyId, deletedAt: null };

    if (search) {
      filter.$or = [
        { 'cid.code': { $regex: search, $options: 'i' } },
        { 'cid.description': { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * itemsPerPage;

    const medicalCertificates = await this.medicalCertificateModel
      .find(filter)
      .populate('collaboratorId')
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 });

    return medicalCertificates;
  }

  async getByUserId(
    { page, itemsPerPage, search }: PaginationParams,
    userId: string,
  ): Promise<MedicalCertificate[]> {
    const filter: any = { collaboratorId: userId, deletedAt: null };

    if (search) {
      filter.$or = [
        { 'cid.code': { $regex: search, $options: 'i' } },
        { 'cid.description': { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * itemsPerPage;

    const medicalCertificates = await this.medicalCertificateModel
      .find(filter)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 });

    return medicalCertificates;
  }
}
