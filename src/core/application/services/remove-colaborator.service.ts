import { ColaboratorRepository } from '@/core/application/repositories/colaborator-repository';
import { UserRepository } from '@/core/application/repositories/user-repository';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface RemoveColaboratorServiceRequest {
  colaboratorId: string;
  userId: string;
}

type RemoveColaboratorServiceResponse = Either<
  EntityNotFoundError,
  {
    message: string;
  }
>;

@Injectable()
export class RemoveColaboratorService {
  constructor(
    private readonly colaboratorRepository: ColaboratorRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    colaboratorId,
    userId,
  }: RemoveColaboratorServiceRequest): Promise<RemoveColaboratorServiceResponse> {
    const userCompany = await this.userRepository.findCompany(userId);

    if (!userCompany) {
      return left(
        new EntityNotFoundError({
          entity: 'Company',
        }),
      );
    }

    const colaborator =
      await this.colaboratorRepository.findById(colaboratorId);

    if (!colaborator) {
      return left(
        new EntityNotFoundError({
          entity: 'Colaborator',
        }),
      );
    }

    if (colaborator.companyId.toString() !== userCompany.id.toString()) {
      return left(
        new EntityNotFoundError({
          entity: 'Colaborator',
        }),
      );
    }

    await this.colaboratorRepository.remove(colaboratorId);

    return right({
      message: 'Colaborador removido com sucesso',
    });
  }
}
