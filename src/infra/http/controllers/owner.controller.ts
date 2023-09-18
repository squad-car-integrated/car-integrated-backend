import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { string, z } from 'zod'
import { CreateOwnerUseCase } from '@/domain/workshop/application/use-cases/Owner/create-owner'
import { UserAlreadyExistsError } from '@/domain/workshop/application/use-cases/errors/user-already-exists-error'
import { GetOwnerByEmailUseCase } from '@/domain/workshop/application/use-cases/Owner/get-owner-by-email'
const ownerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phoneNumber: z.string().optional(),
})
const ownerEmailSchema = z.object({
  email: z.string().email(),
})
type OwnerBodySchema = z.infer<typeof ownerSchema>
type OwnerEmailBodySchema = z.infer<typeof ownerEmailSchema>
@Controller('/owner')
export class OwnerController {
  constructor(
    private createOwner: CreateOwnerUseCase,
    private getOwnerByEmail: GetOwnerByEmailUseCase,
  ) {}
  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(ownerEmailSchema))
  async handleGetOwnerById(@Body() body: OwnerEmailBodySchema) {
    const { email } = body
    console.log(email)
    const result = await this.getOwnerByEmail.execute({
      email,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const owner = result.value.owner
    return {
      owner: owner,
    }
  }
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(ownerSchema))
  async handleRegisterOwner(@Body() body: OwnerBodySchema) {
    const { name, email, password, phoneNumber } = body

    const result = await this.createOwner.execute({
      name,
      email,
      password,
      phoneNumber: phoneNumber ?? '',
    })
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
