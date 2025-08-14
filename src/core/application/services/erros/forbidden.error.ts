import { UseCaseError } from '@/core/application/services/erros/use-case-error';

export class ForbiddenError extends Error implements UseCaseError {
  constructor() {
    super(`You do not have permission to perform this action.`);
  }
}
