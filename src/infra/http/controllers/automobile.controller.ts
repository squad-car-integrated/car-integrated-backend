import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
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
import { CreateAutomobileUseCase } from '@/domain/workshop/application/use-cases/Automobile/create-automobile'
import { AutomobilePresenter } from '../presenters/automobile-presenter'
import { GetAutomobileByIdUseCase } from '@/domain/workshop/application/use-cases/Automobile/get-automobile-by-id'
import { AutomobileAlreadyExistsError } from '@/domain/workshop/application/use-cases/errors/automobile-already-exists-error'
import { FetchRecentAutomobilesUseCase } from '@/domain/workshop/application/use-cases/Automobile/fetch-recent-automobile'
import { EditAutomobileUseCase } from '@/domain/workshop/application/use-cases/Automobile/edit-automobile'
const automobileSchema = z.object({
  model: z.string(),
  brand: z.string(),
  plate: z.string(),
  ownerId: z.string().uuid(),
})
const automobileIdSchema = z.object({
  id: z.string().uuid(),
})
const pageQueryParamSchema = z.string().optional().default("1").transform(Number).pipe(z.number().min(1))
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type AutomobileBodySchema = z.infer<typeof automobileSchema>
type AutomobileIdBodySchema = z.infer<typeof automobileIdSchema>
@Controller('/automobile')
export class AutomobileController {
  constructor(
    private createAutomobile: CreateAutomobileUseCase,
    private getAutomobileById: GetAutomobileByIdUseCase,
    private fetchAutomobile: FetchRecentAutomobilesUseCase,
    private editAutomobile: EditAutomobileUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handleFetchAutomobile(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchAutomobile.execute({page})
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    let automobiles: AutomobilePresenter[] = [];
    result.value.automobiles.forEach(element => {
      const convert = AutomobilePresenter.toHTTP(element)
      automobiles.push(convert)
    });
    return {
      automobiles
    }
  }

  @Get("/:id")
  @HttpCode(200)
  async handleGetAutomobileById(@Param() automobileId: string) {
    const result = await this.getAutomobileById.execute({
      id: automobileId,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const automobile = result.value.automobile
    return {
      automobile: AutomobilePresenter.toHTTP(automobile),
    }
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(automobileSchema))
  async handleRegisterAutomobile(@Body() body: AutomobileBodySchema) {
    const { model, brand, plate, ownerId } = body

    const result = await this.createAutomobile.execute({
      model,
      brand,
      plate,
      ownerId,
    })
    if (result.isLeft()) {
      const error = result.value
      if (error instanceof AutomobileAlreadyExistsError) {
        throw new ConflictException(error.message)
      } else {
        throw new BadRequestException(error.message)
      }
    }
  }
  @Put("/:id")
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(automobileSchema))
  async handleEditAutomobile(@Body() body: AutomobileBodySchema, @Param("id") automobileId: string) {
    const { model, brand, plate, ownerId } = body

    const result = await this.editAutomobile.execute({
      model,
      brand,
      plate,
      ownerId,
      automobileId
    })
    if (result.isLeft()) {
      const error = result.value
      if (error instanceof AutomobileAlreadyExistsError) {
        throw new ConflictException(error.message)
      } else {
        throw new BadRequestException(error.message)
      }
    }
  }
}
