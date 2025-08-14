import { PaginationParams } from '@/common/interfaces/pagination-params';
import { MedicalCertificateRepository } from '@/core/application/repositories/medical-certificate-repository';
import { UserRepository } from '@/core/application/repositories/user-repository';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { Either, left, right } from '@/core/either';
import { MedicalCertificate } from '@/core/entities/medical-certificate';
import { Injectable } from '@nestjs/common';

interface GetAllMedicalCertificatesServiceRequest {
  paginationParams: PaginationParams;
  userId: string;
}

type GetAllMedicalCertificatesServiceResponse = Either<
  EntityNotFoundError,
  {
    medicalCertificates: MedicalCertificate[];
  }
>;

@Injectable()
export class GetAllMedicalCertificatesService {
  constructor(
    private readonly medicalCertificateRepository: MedicalCertificateRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    paginationParams,
    userId,
  }: GetAllMedicalCertificatesServiceRequest): Promise<GetAllMedicalCertificatesServiceResponse> {
    const userCompany = await this.userRepository.findCompany(userId);

    if (!userCompany) {
      return left(
        new EntityNotFoundError({
          entity: 'Company',
        }),
      );
    }

    const medicalCertificates = await this.medicalCertificateRepository.getAll(
      paginationParams,
      userCompany.id,
    );

    return right({
      medicalCertificates,
    });
  }
}
