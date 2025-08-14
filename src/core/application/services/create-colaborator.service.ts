import { ColaboratorRepository } from '@/core/application/repositories/colaborator-repository';
import { UserRepository } from '@/core/application/repositories/user-repository';
import { EntityAlreadyExistsError } from '@/core/application/services/erros/entity-already-exists.error';
import { Either, left, right } from '@/core/either';
import { Colaborator } from '@/core/entities/colaborator';
import { Injectable } from '@nestjs/common';

interface CreateColaboratorServiceRequest {
  fullname: string;
  birthdate: string;
  cpf: string;
  role: string;
  user_id: string;
}

type CreateColaboratorServiceResponse = Either<
  EntityAlreadyExistsError,
  {
    colaborator: Colaborator;
  }
>;

@Injectable()
export class CreateColaboratorService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly colaboratorRepository: ColaboratorRepository,
  ) {}

  async execute({
    fullname,
    birthdate,
    role,
    cpf,
    user_id,
  }: CreateColaboratorServiceRequest): Promise<CreateColaboratorServiceResponse> {
    const colaboratorAlreadyExists =
      await this.colaboratorRepository.findByCpf(cpf);

    if (colaboratorAlreadyExists) {
      return left(
        new EntityAlreadyExistsError({
          entity: 'Colaborator',
          identifier: 'cpf',
          value: cpf,
        }),
      );
    }

    const company = await this.userRepository.findCompany(user_id);

    console.log('company', company);

    if (!company) {
      return left(
        new EntityAlreadyExistsError({
          entity: 'Colaborator',
          identifier: 'company',
          value: user_id,
        }),
      );
    }

    const colaborator = Colaborator.create({
      fullname,
      birthdate,
      cpf,
      companyId: company?.id,
      role,
      status: 'active',
    });

    const newColaborator = await this.colaboratorRepository.create(colaborator);

    return right({
      colaborator: newColaborator,
    });
  }
}
