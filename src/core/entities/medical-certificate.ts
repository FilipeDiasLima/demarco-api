import { Entity } from '@/common/entity';

interface CidProps {
  code: string;
  description: string;
}

interface MedicalCertificateProps {
  collaboratorId: string;
  certificateDateTime: Date;
  companyId: string;
  leaveDays: number;
  cid: CidProps;
  notes?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export class MedicalCertificate extends Entity<MedicalCertificateProps> {
  get collaboratorId() {
    return this.props.collaboratorId;
  }

  get certificateDateTime() {
    return this.props.certificateDateTime;
  }

  get companyId() {
    return this.props.companyId;
  }

  get leaveDays() {
    return this.props.leaveDays;
  }

  get cid() {
    return this.props.cid;
  }

  get notes() {
    return this.props.notes;
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

  static create(props: MedicalCertificateProps, _id?: string) {
    const medicalCertificate = new MedicalCertificate(props, _id);

    return medicalCertificate;
  }
}
