import { UseCaseError } from '@/core/application/services/erros/use-case-error';

interface EntityNotFoundErrorProps {
  entity: 'User' | 'Company' | 'Colaborator';
}

export class EntityNotFoundError extends Error implements UseCaseError {
  constructor({ entity }: EntityNotFoundErrorProps) {
    super(`${entity} not found.`);
  }
}
