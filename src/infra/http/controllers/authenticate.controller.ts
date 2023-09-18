import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateOwnerUseCase } from '@/domain/workshop/application/use-cases/Owner/create-owner'
import { UserAlreadyExistsError } from '@/domain/workshop/application/use-cases/errors/user-already-exists-error'
import { CreateEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/create-employee'
import { AuthenticateUserUseCase } from '@/domain/workshop/application/use-cases/Authenticate/authenticate-user'
import { WrongCredentialsError } from '@/domain/workshop/application/use-cases/errors/wrong-credentials-error'
const AuthenticateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
type AuthenticateBodySchema = z.infer<typeof AuthenticateSchema>
@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}
  @Post()
  @UsePipes(new ZodValidationPipe(AuthenticateSchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body
    const result = await this.authenticateUser.execute({
      email,
      password,
    })
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const { accessToken } = result.value
    return {
      access_token: accessToken,
    }
  }
}
