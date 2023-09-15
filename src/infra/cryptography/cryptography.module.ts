import { Module } from '@nestjs/common'

import { BcryptHasher } from './bcrypt-hasher.ts'
import { HashComparer } from '@/domain/workshop/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/workshop/application/cryptography/hasher-generator'
import { JwtEncrypter } from './jwt-encrypter'
import { Encrypter } from '@/domain/workshop/application/cryptography/encrypter'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}