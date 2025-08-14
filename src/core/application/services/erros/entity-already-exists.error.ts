import { UseCaseError } from '@/core/application/services/erros/use-case-error';

interface EntityAlreadyExistsErrorProps {
  entity: 'User' | 'Colaborator' | 'Company';
  identifier: string;
  value: string;
}

export class EntityAlreadyExistsError extends Error implements UseCaseError {
  constructor({ entity, identifier, value }: EntityAlreadyExistsErrorProps) {
    super(`${entity} with the same ${identifier} "${value}" already exists.`);
  }
}
