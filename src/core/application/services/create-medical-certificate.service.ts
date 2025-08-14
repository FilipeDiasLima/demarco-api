import { ColaboratorRepository } from '@/core/application/repositories/colaborator-repository';
import { MedicalCertificateRepository } from '@/core/application/repositories/medical-certificate-repository';
import { UserRepository } from '@/core/application/repositories/user-repository';
import { EntityAlreadyExistsError } from '@/core/application/services/erros/entity-already-exists.error';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { ForbiddenError } from '@/core/application/services/erros/forbidden.error';
import { Either, left, right } from '@/core/either';
import { MedicalCertificate } from '@/core/entities/medical-certificate';
import { Injectable } from '@nestjs/common';

interface CreateMedicalCertificateServiceRequest {
  collaboratorId: string;
  certificateDateTime: Date;
  leaveDays: number;
  cid: {
    code: string;
    description: string;
  };
  notes?: string;
  user_id: string;
}

type CreateMedicalCertificateServiceResponse = Either<
  EntityAlreadyExistsError,
  {
    medicalCertificate: MedicalCertificate;
  }
>;

@Injectable()
export class CreateMedicalCertificateService {
  constructor(
    private readonly medicalCertificateRepository: MedicalCertificateRepository,
    private readonly colaboratorRepository: ColaboratorRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    collaboratorId,
    certificateDateTime,
    leaveDays,
    cid,
    notes,
    user_id,
  }: CreateMedicalCertificateServiceRequest): Promise<CreateMedicalCertificateServiceResponse> {
    const userCompany = await this.userRepository.findCompany(user_id);

    if (!userCompany) {
      return left(
        new EntityAlreadyExistsError({
          entity: 'User',
          identifier: 'company',
          value: user_id,
        }),
      );
    }

    const colaborator =
      await this.colaboratorRepository.findById(collaboratorId);

    if (!colaborator) {
      return left(
        new EntityNotFoundError({
          entity: 'Colaborator',
        }),
      );
    }

    if (colaborator.companyId.toString() !== userCompany.id.toString()) {
      return left(new ForbiddenError());
    }

    const medicalCertificate = MedicalCertificate.create({
      collaboratorId,
      certificateDateTime,
      leaveDays,
      cid,
      companyId: userCompany.id,
      notes,
    });

    const newMedicalCertificate =
      await this.medicalCertificateRepository.create(medicalCertificate);

    return right({
      medicalCertificate: newMedicalCertificate,
    });
  }
}
