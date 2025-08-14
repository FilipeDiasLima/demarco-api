import { Entity } from '@/common/entity';

interface ColaboratorProps {
  fullname: string;
  companyId: string;
  cpf: string;
  birthdate: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export class Colaborator extends Entity<ColaboratorProps> {
  get fullname() {
    return this.props.fullname;
  }

  get companyId() {
    return this.props.companyId;
  }

  get cpf() {
    return this.props.cpf;
  }

  get birthdate() {
    return this.props.birthdate;
  }

  get role() {
    return this.props.role;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  static create(props: ColaboratorProps, _id?: string) {
    const colaborator = new Colaborator(props, _id);

    return colaborator;
  }
}
