import { HasherComparer } from "@/core/application/cryptography/hasher-comparer";
import { HasherGenerator } from "@/core/application/cryptography/hasher-generator";
import { compare, hash } from "bcryptjs";

export class BcryptHasher implements HasherGenerator, HasherComparer {
  private HASH_SALT = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
