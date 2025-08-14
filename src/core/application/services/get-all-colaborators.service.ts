import { ColaboratorRepository } from '@/core/application/repositories/colaborator-repository';
import { UserRepository } from '@/core/application/repositories/user-repository';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { Either, left, right } from '@/core/either';
import { Colaborator } from '@/core/entities/colaborator';
import { Injectable } from '@nestjs/common';

interface GetAllColaboratorsRequest {
  user_id: string;
  page: number;
  itemsPerPage: number;
  search?: string | null;
}

type GetAllColaboratorsResponse = Either<
  EntityNotFoundError,
  {
    colaborators: Colaborator[];
  }
>;

@Injectable()
export class GetAllColaboratorsService {
  constructor(
    private readonly colaboratorRepository: ColaboratorRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    user_id,
    itemsPerPage,
    page,
    search,
  }: GetAllColaboratorsRequest): Promise<GetAllColaboratorsResponse> {
    const company = await this.userRepository.findCompany(user_id);

    if (!company) {
      return left(
        new EntityNotFoundError({
          entity: 'Company',
        }),
      );
    }

    const colaborators = await this.colaboratorRepository.getAllByCompany(
      { itemsPerPage, page, search },
      company.id,
    );

    return right({
      colaborators,
    });
  }
}
