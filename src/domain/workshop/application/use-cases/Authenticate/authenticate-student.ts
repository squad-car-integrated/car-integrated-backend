import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { Encrypter } from "../../cryptography/encrypter"
import { HashComparer } from "../../cryptography/hash-comparer"
import { UsersRepository } from "../../repositories/users-repository"
import { WrongCredentialsError } from "../errors/wrong-credentials-error"

interface AuthenticateUserUseCaseRequest {
    email: string
    password: string
}
type AuthenticateUserUseCaseResponse = Either<WrongCredentialsError, {
    accessToken: string
}>
@Injectable()
export class AuthenticateUserUseCase { 
    constructor(
        private userRepository: UsersRepository,
        private hashComparer: HashComparer,
        private encrypter: Encrypter
    ){}
    async execute({email, password}: AuthenticateUserUseCaseRequest) : Promise<AuthenticateUserUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email)
        if(!user){
            return left(new WrongCredentialsError())
        }
        const isPasswordValid = await this.hashComparer.compare(password, user.password)
        if(!isPasswordValid){
            return left(new WrongCredentialsError())
        }
        const accessToken = await this.encrypter.encrypt({sub: user.id.toString()})
        return right({
            accessToken
        })
    }
    
}