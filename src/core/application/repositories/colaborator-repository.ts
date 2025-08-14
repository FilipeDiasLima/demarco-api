import { PaginationParams } from '@/common/interfaces/pagination-params';
import { Colaborator } from '@/core/entities/colaborator';

export abstract class ColaboratorRepository {
  abstract create(colaborator: Colaborator): Promise<Colaborator>;
  abstract findById(id: string): Promise<Colaborator | null>;
  abstract findByCpf(email: string): Promise<Colaborator | null>;
  abstract getAllByCompany(
    params: PaginationParams,
    companyId: string,
  ): Promise<Colaborator[]>;
  abstract toggleStatus(colaboratorId: string): Promise<void>;
  abstract remove(colaboratorId: string): Promise<void>;
}
