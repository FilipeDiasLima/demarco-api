import { UserRepository } from '@/core/application/repositories/user-repository';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { Either, left, right } from '@/core/either';
import { User } from '@/core/entities/user';
import { Injectable } from '@nestjs/common';

interface GetUserServiceRequest {
  userId: string;
}

type GetUserServiceResponse = Either<
  EntityNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class GetUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUserServiceRequest): Promise<GetUserServiceResponse> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      return left(
        new EntityNotFoundError({
          entity: 'User',
        }),
      );
    }

    return right({
      user,
    });
  }
}
