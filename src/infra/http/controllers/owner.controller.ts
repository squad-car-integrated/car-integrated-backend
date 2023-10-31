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
  Put,
  Query,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateOwnerUseCase } from '@/domain/workshop/application/use-cases/Owner/create-owner'
import { UserAlreadyExistsError } from '@/domain/workshop/application/use-cases/errors/user-already-exists-error'
import { OnwerPresenter } from '../presenters/owner-presenter'
import { GetOwnerByIdUseCase } from '@/domain/workshop/application/use-cases/Owner/get-owner-by-id'
import { DeleteOwnerUseCase } from '@/domain/workshop/application/use-cases/Owner/delete-owner'
import { FetchAllOwnersUseCase } from '@/domain/workshop/application/use-cases/Owner/fetch-all-owners'
import { EditOwnerUseCase } from '@/domain/workshop/application/use-cases/Owner/edit-owner'
const ownerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phoneNumber: z.string(),
})
const pageQueryParamSchema = z.string().optional().default("1").transform(Number).pipe(z.number().min(1))
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type OwnerBodySchema = z.infer<typeof ownerSchema>
@Controller('/owner')
export class OwnerController {
  constructor(
    private createOwner: CreateOwnerUseCase,
    private getOwnerById: GetOwnerByIdUseCase,
    private deleteOnwer: DeleteOwnerUseCase,
    private editOwner: EditOwnerUseCase,
    private fetchAllOwners: FetchAllOwnersUseCase
  ) {}
  
  @Get()
  @HttpCode(200)
  async handleFetchOwner(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchAllOwners.execute({page})
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const owners = result.value.owners
    return {
      owners : owners.map(OnwerPresenter.toHTTP)
    }
  }
  @Get("/:id")
  @HttpCode(200)
  async handleGetOwnerById(@Param("id") ownerId: string) {
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
  @Put('/:id')
  @HttpCode(204)
  async handleEditOwner(@Body(new ZodValidationPipe(ownerSchema)) body: OwnerBodySchema, @Param("id") ownerId: string) {
    const { name, email, password, phoneNumber } = body
    const result = await this.editOwner.execute({
      ownerId,
      name,
      email,
      password,
      phoneNumber,
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
