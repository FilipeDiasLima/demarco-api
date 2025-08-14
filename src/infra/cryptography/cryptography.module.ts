import { Encrypter } from '@/core/application/cryptography/encrypter';
import { HasherComparer } from '@/core/application/cryptography/hasher-comparer';
import { HasherGenerator } from '@/core/application/cryptography/hasher-generator';
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HasherComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HasherGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HasherComparer, HasherGenerator],
})
export class CryptographyModule {}
