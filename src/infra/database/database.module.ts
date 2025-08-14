import { ColaboratorRepository } from '@/core/application/repositories/colaborator-repository';
import { MedicalCertificateRepository } from '@/core/application/repositories/medical-certificate-repository';
import { UserRepository } from '@/core/application/repositories/user-repository';
import { ColaboratorSchema } from '@/infra/database/mongo/model/colaborator.model';
import { CompanySchema } from '@/infra/database/mongo/model/company.model';
import { MedicalCertificateSchema } from '@/infra/database/mongo/model/medical-certificate.model';
import { UserSchema } from '@/infra/database/mongo/model/user.model';
import { MongoColaboratorRepository } from '@/infra/database/mongo/repositories/mongo-colaborator-repository';
import { MongoMedicalCertificateRepository } from '@/infra/database/mongo/repositories/mongo-medical-certificate-repository';
import { MongoUserRepository } from '@/infra/database/mongo/repositories/mongo-user-repository';
import { EnvModule } from '@/infra/env/env.module';
import { EnvService } from '@/infra/env/env.service';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    EnvModule,
    MongooseModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        uri: env.get('DATABASE_URL'),
      }),
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'Colaborator', schema: ColaboratorSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    MongooseModule.forFeature([
      { name: 'MedicalCertificate', schema: MedicalCertificateSchema },
    ]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: MongoUserRepository,
    },
    {
      provide: ColaboratorRepository,
      useClass: MongoColaboratorRepository,
    },
    {
      provide: MedicalCertificateRepository,
      useClass: MongoMedicalCertificateRepository,
    },
  ],
  exports: [
    UserRepository,
    ColaboratorRepository,
    MedicalCertificateRepository,
  ],
})
export class DatabaseModule {}
