import { Entity } from '@/common/entity';

interface UserProps {
  fullname: string;
  email: string;
  cpf: string;
  birthdate?: string;
  role?: 'user' | 'admin';
  password?: string;
  isActive?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  get fullname() {
    return this.props.fullname;
  }

  get email() {
    return this.props.email;
  }

  get cpf() {
    return this.props.cpf;
  }

  get role() {
    return this.props.role;
  }

  get password() {
    return this.props.password;
  }

  get birthdate() {
    return this.props.birthdate;
  }

  get isActive() {
    return this.props.isActive;
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

  static create(props: UserProps, _id?: string) {
    const user = new User(props, _id);

    return user;
  }
}
