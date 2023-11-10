import { Either, left, right } from '@/core/either'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Encrypter } from '../../cryptography/encrypter'
import { HashComparer } from '../../cryptography/hash-comparer'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'
import { OwnersRepository } from '../../repositories/owners-repository'
import { EmployeesRepository } from '../../repositories/employees-repository'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'

interface AuthenticateUserUseCaseRequest {
    email: string
    password: string
}
type AuthenticateUserUseCaseResponse = Either<
    WrongCredentialsError | BadRequestException,
    {
        accessToken: string
    }
>
@Injectable()
export class AuthenticateUserUseCase {
    constructor(
        private employeesRepository: EmployeesRepository,
        private ownersRepository: OwnersRepository,
        private hashComparer: HashComparer,
        private encrypter: Encrypter,
    ) {}
    async execute({
        email,
        password,
    }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
        let user: Owner | Employee | null
        user = await this.employeesRepository.findByEmail(email)

        if (!user) {
            user = await this.ownersRepository.findByEmail(email)
            if (!user) {
                return left(new WrongCredentialsError())
            }
        }
        const isPasswordValid = await this.hashComparer.compare(
            password,
            user.password,
        )
        if (!isPasswordValid) {
            return left(new WrongCredentialsError())
        }
        const accessToken = await this.encrypter.encrypt({
            sub: user.id.toString(),
            email: user.email
        })
        return right({
            accessToken,
        })
    }
}
