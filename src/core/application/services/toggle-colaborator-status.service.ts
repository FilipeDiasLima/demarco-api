import { ColaboratorRepository } from '@/core/application/repositories/colaborator-repository';
import { UserRepository } from '@/core/application/repositories/user-repository';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { ForbiddenError } from '@/core/application/services/erros/forbidden.error';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface ToggleColaboratorStatusRequest {
  user_id: string;
  colaborator_id: string;
}

type ToggleColaboratorStatusResponse = Either<EntityNotFoundError, {}>;

@Injectable()
export class ToggleColaboratorStatusService {
  constructor(
    private readonly colaboratorRepository: ColaboratorRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    user_id,
    colaborator_id,
  }: ToggleColaboratorStatusRequest): Promise<ToggleColaboratorStatusResponse> {
    const company = await this.userRepository.findCompany(user_id);

    if (!company) {
      return left(
        new EntityNotFoundError({
          entity: 'Company',
        }),
      );
    }

    const colaborator =
      await this.colaboratorRepository.findById(colaborator_id);

    if (!colaborator) {
      return left(
        new EntityNotFoundError({
          entity: 'Colaborator',
        }),
      );
    }

    console.log('colaborator.companyId', colaborator.companyId);
    console.log('company.id', company.id);

    if (colaborator.companyId.toString() !== company.id.toString()) {
      return left(new ForbiddenError());
    }

    await this.colaboratorRepository.toggleStatus(colaborator_id);

    return right({});
  }
}
