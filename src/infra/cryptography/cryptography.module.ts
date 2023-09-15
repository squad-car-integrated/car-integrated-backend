import { Module } from '@nestjs/common'

import { BcryptHasher } from './bcrypt-hasher.ts'
import { Encrypter } from '@/domain/workshop/application/cryptography/encrypter.js'
import { HashComparer } from '@/domain/workshop/application/cryptography/hash-comparer.js'
import { HashGenerator } from '@/domain/workshop/application/cryptography/hasher-generator.js'
import { JwtEncrypter } from './jwt-encrypter.js'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}