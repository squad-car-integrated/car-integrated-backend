import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateOwnerUseCase } from '@/domain/workshop/application/use-cases/Owner/create-owner'
import { UserAlreadyExistsError } from '@/domain/workshop/application/use-cases/errors/user-already-exists-error'
import { OnwerPresenter } from '../presenters/owner-presenter'
import { GetOwnerByIdUseCase } from '@/domain/workshop/application/use-cases/Owner/get-owner-by-id'
import { DeleteOwnerUseCase } from '@/domain/workshop/application/use-cases/Owner/delete-owner'
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
@Controller('/owner')
export class OwnerController {
  constructor(
    private createOwner: CreateOwnerUseCase,
    private getOwnerById: GetOwnerByIdUseCase,
    private deleteOnwer: DeleteOwnerUseCase
  ) {}
  
  @Get()
  @HttpCode(200)
  async handleGetOwnerById(@Param() ownerId: string) {
    const result = await this.getOwnerById.execute({
      id: ownerId
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const owner = result.value.owner
    return {
      owner: OnwerPresenter.toHTTP(owner),
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
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message)
      } else {
        throw new BadRequestException(error.message)
      }
    }
  }
  @Delete("/:id")
  @HttpCode(204)
  async handleDeleteOwner(@Param("id") ownerId: string) {

    const result = await this.deleteOnwer.execute({
      ownerId
    })
    if (result.isLeft()) {
      const error = result.value
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message)
      } else {
        throw new BadRequestException(error.message)
      }
    }
  }
}
