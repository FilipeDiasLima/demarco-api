import { Encrypter } from '@/core/application/cryptography/encrypter';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(
    payload: Record<string, unknown>,
    options?: JwtSignOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }
}
