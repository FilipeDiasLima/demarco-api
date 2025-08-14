import { Entity } from '@/common/entity';

interface CompanyProps {
  name: string;
  owner: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export class Company extends Entity<CompanyProps> {
  get name() {
    return this.props.name;
  }

  get owner() {
    return this.props.owner;
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

  static create(props: CompanyProps, _id?: string) {
    const company = new Company(props, _id);

    return company;
  }
}
