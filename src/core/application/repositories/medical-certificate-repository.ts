import { PaginationParams } from '@/common/interfaces/pagination-params';
import { MedicalCertificate } from '@/core/entities/medical-certificate';

export abstract class MedicalCertificateRepository {
  abstract create(
    medicalCertificate: MedicalCertificate,
  ): Promise<MedicalCertificate>;

  abstract getAll(
    paginationParams: PaginationParams,
    companyId: string,
  ): Promise<MedicalCertificate[]>;

  abstract getByUserId(
    paginationParams: PaginationParams,
    userId: string,
  ): Promise<MedicalCertificate[]>;
}
