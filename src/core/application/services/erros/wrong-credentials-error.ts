import { UseCaseError } from '@/core/application/services/erros/use-case-error';

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super(`Credentials are not valid.`);
  }
}
