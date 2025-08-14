import { AuthenticateService } from '@/core/application/services/authenticate.service';
import { CreateColaboratorService } from '@/core/application/services/create-colaborator.service';
import { CreateMedicalCertificateService } from '@/core/application/services/create-medical-certificate.service';
import { GetAllColaboratorsService } from '@/core/application/services/get-all-colaborators.service';
import { GetAllMedicalCertificatesService } from '@/core/application/services/get-all-medical-certificates.service';
import { GetCIDByIdService } from '@/core/application/services/get-cid-by-id.service';
import { GetCIDsService } from '@/core/application/services/get-cids.service';
import { GetUserService } from '@/core/application/services/get-user.service';
import { OMSTokenService } from '@/core/application/services/oms-token.service';
import { RegisterUserService } from '@/core/application/services/register-user.service';
import { RemoveColaboratorService } from '@/core/application/services/remove-colaborator.service';
import { ToggleColaboratorStatusService } from '@/core/application/services/toggle-colaborator-status.service';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnvModule } from '@/infra/env/env.module';
import { AuthenticateController } from '@/infra/http/controllers/authenticate-user.controller';
import { CreateColaboratorController } from '@/infra/http/controllers/create-colaborator.controller';
import { CreateMedicalCertificateController } from '@/infra/http/controllers/create-medical-certificate.controller';
import { GetAllColaboratorsController } from '@/infra/http/controllers/get-all-colaborators.controller';
import { GetAllMedicalCertificatesController } from '@/infra/http/controllers/get-all-medical-certificates.controller';
import { GetCIDByIdController } from '@/infra/http/controllers/get-cid-by-id.controller';
import { GetCIDsController } from '@/infra/http/controllers/get-cids.controller';
import { GetUserController } from '@/infra/http/controllers/get-user.controller';
import { RegisterUserController } from '@/infra/http/controllers/register-user.controller';
import { RemoveColaboratorController } from '@/infra/http/controllers/remove-colaborator.controller';
import { ToggleColaboratorStatusController } from '@/infra/http/controllers/toggle-colaborator-status.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    RegisterUserController,
    AuthenticateController,
    CreateColaboratorController,
    CreateMedicalCertificateController,
    GetAllColaboratorsController,
    GetAllMedicalCertificatesController,
    GetCIDByIdController,
    GetCIDsController,
    GetUserController,
    RemoveColaboratorController,
    ToggleColaboratorStatusController,
  ],
  providers: [
    RegisterUserService,
    AuthenticateService,
    CreateColaboratorService,
    CreateMedicalCertificateService,
    GetAllColaboratorsService,
    GetAllMedicalCertificatesService,
    GetCIDByIdService,
    GetCIDsService,
    GetUserService,
    OMSTokenService,
    RemoveColaboratorService,
    ToggleColaboratorStatusService,
  ],
})
export class HttpModule {}
