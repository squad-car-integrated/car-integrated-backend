import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UnauthorizedException,
    UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/domain/workshop/application/use-cases/Authenticate/authenticate-user'
import { WrongCredentialsError } from '@/domain/workshop/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserSwaggerDTO } from '@/core/entities/user-swagger-dto'
const AuthenticateSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})
type AuthenticateBodySchema = z.infer<typeof AuthenticateSchema>
@ApiTags('CarIntegrated')
@Controller('/sessions')
export class AuthenticateController {
    constructor(
        private authenticateUser: AuthenticateUserUseCase,
        ) {}

    @Post()
    @Public()
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({
        type: UserSwaggerDTO,
        description: 'Json structure for user object',
    })
    @UsePipes(new ZodValidationPipe(AuthenticateSchema))
    async handleSignIn(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body
        const result = await this.authenticateUser.execute({
            email,
            password,
        })
        if (result.isLeft()) {
            const error = result.value
            if (error instanceof WrongCredentialsError) {
                throw new UnauthorizedException(error.message)
            } else {
                throw new BadRequestException(error.message)
            }
        }
        const { accessToken } = result.value
        return {
            access_token: accessToken,
        }
    }
}
