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
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnprocessableEntityResponse,
    ApiQuery
} from '@nestjs/swagger'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import { GetAutomobileByPlateUseCase } from '@/domain/workshop/application/use-cases/Automobile/get-automobile-by-plate'
const automobileSchema = z.object({
    model: z.string().toUpperCase(),
    brand: z.string().toUpperCase(),
    plate: z.string().toUpperCase(),
    ownerId: z.string().uuid(),
})
const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type AutomobileBodySchema = z.infer<typeof automobileSchema>
@ApiTags('CarIntegrated')
@ApiBearerAuth('defaultBearerAuth')
@Controller('/automobile')
export class AutomobileController {
    constructor(
        private createAutomobile: CreateAutomobileUseCase,
        private getAutomobileByPlate: GetAutomobileByPlateUseCase,
        private getAutomobileById: GetAutomobileByIdUseCase,
        private fetchAutomobile: FetchRecentAutomobilesUseCase,
        private editAutomobile: EditAutomobileUseCase,
    ) {}
    @Get()
    @ApiOperation({ summary: 'Fetch cars by page' })
    @HttpCode(200)
    async handleFetchAutomobile(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    ) {
        const result = await this.fetchAutomobile.execute({ page })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
        let automobiles: AutomobilePresenter[] = []
        result.value.automobiles.forEach((element) => {
            const convert = AutomobilePresenter.toHTTP(element)
            automobiles.push(convert)
        })
        const pages = result.value.totalPages
        return {
            automobiles,
            pages
        }
    }

    @Get('/:id')
    @HttpCode(200)
    //Swagger
    @ApiOperation({ summary: 'Find Car by id' })
    @ApiResponse({
        status: 200,
        description: 'Car found',
        type: Automobile,
    })
    //Fim do Swagger
    async handleGetAutomobileById(@Param('id') automobileId: string) {
        const result = await this.getAutomobileById.execute({
            id: automobileId,
        })
        if (result.isLeft()) {
            throw new BadRequestException(result.value?.message)
        }
        const automobile = result.value.automobile
        return {
            automobile: AutomobilePresenter.toHTTP(automobile),
        }
    }
    @Get('/plate/:plate')
    @HttpCode(200)
    //Swagger
    @ApiOperation({ summary: 'Find Car by plate' })
    @ApiResponse({
        status: 200,
        description: 'Car found',
        type: Automobile,
    })
    //Fim do Swagger
    async handleGetAutomobileByPlate(@Param('plate') automobilePlate: string) {
        const result = await this.getAutomobileByPlate.execute({
            plate: automobilePlate,
        })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
        let automobiles: AutomobilePresenter[] = []
        result.value.automobiles.forEach((element) => {
            const convert = AutomobilePresenter.toHTTP(element)
            automobiles.push(convert)
        })
        return {
            automobiles
        }
    }

    @Post()
    //Swagger
    @ApiOperation({ summary: 'Create Car' })
    @ApiResponse({
        status: 201,
        description: 'Created Car',
        type: Automobile,
    })
    @ApiCreatedResponse({ description: 'Created Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiBody({
        type: Automobile,
        description: 'Json structure for user object',
    })
    //Fim do Swagger
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
    @Put('/:id')
    @HttpCode(204)
    //Swagger
    @ApiOperation({ summary: 'Edit Car by id' })
    @ApiOkResponse({ description: 'The resource was updated successfully' })
    @ApiNotFoundResponse({ description: 'Resource not found' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiBody({
        type: Automobile,
        description: 'Json structure for user object',
    })
    @ApiResponse({
        status: 200,
        description: 'Car edited',
        type: Automobile,
    })
    //Fim do Swagger
    @UsePipes(new ZodValidationPipe(automobileSchema))
    async handleEditAutomobile(
        @Body() body: AutomobileBodySchema,
        @Param('id') automobileId: string,
    ) {
        const { model, brand, plate, ownerId } = body

        const result = await this.editAutomobile.execute({
            model,
            brand,
            plate,
            ownerId,
            automobileId,
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
