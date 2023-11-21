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
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiCreatedResponse,
    ApiUnprocessableEntityResponse,
    ApiForbiddenResponse,
    ApiBody,
    ApiOkResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'
const ownerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    phoneNumber: z.string(),
})
const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type OwnerBodySchema = z.infer<typeof ownerSchema>
@Controller('/owner')
@ApiTags('CarIntegrated')
@ApiBearerAuth('defaultBearerAuth')
export class OwnerController {
    constructor(
        private createOwner: CreateOwnerUseCase,
        private getOwnerById: GetOwnerByIdUseCase,
        private deleteOnwer: DeleteOwnerUseCase,
        private editOwner: EditOwnerUseCase,
        private fetchAllOwners: FetchAllOwnersUseCase,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Fetch owners by page' })
    @HttpCode(200)
    async handleFetchOwner(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    ) {
        const result = await this.fetchAllOwners.execute({ page })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
        const owners = result.value.owners
        return {
            owners: owners.map(OnwerPresenter.toHTTP),
        }
    }
    @Get('/:id')
    @HttpCode(200)
    //Swagger
    @ApiOperation({ summary: 'Find owner by id' })
    @ApiResponse({
        status: 200,
        description: 'Car found',
        type: Owner,
    })
    //Fim do Swagger
    async handleGetOwnerById(@Param('id') ownerId: string) {
        const result = await this.getOwnerById.execute({
            id: ownerId,
        })
        if (result.isLeft()) {
            throw new BadRequestException(result.value?.message)
        }
        const owner = result.value.owner
        return {
            owner: OnwerPresenter.toHTTP(owner),
        }
    }
    @Post()
    @HttpCode(201)
    @HttpCode(201)
    //Swagger
    @ApiOperation({ summary: 'Create Owner' })
    @ApiResponse({
        status: 201,
        description: 'Created Owner',
        type: Owner,
    })
    @ApiCreatedResponse({ description: 'Created Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiBody({
        type: Owner,
        description: 'Json structure for Owner object',
    })
    //Fim do Swagger
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
    //Swagger
    @ApiOperation({ summary: 'Edit Owner by id' })
    @ApiOkResponse({ description: 'The resource was updated successfully' })
    @ApiNotFoundResponse({ description: 'Resource not found' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiBody({
        type: Owner,
        description: 'Json structure for user object',
    })
    @ApiResponse({
        status: 200,
        description: 'Owner edited',
        type: Owner,
    })
    //Fim do Swagger
    async handleEditOwner(
        @Body(new ZodValidationPipe(ownerSchema)) body: OwnerBodySchema,
        @Param('id') ownerId: string,
    ) {
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
    @Delete('/:id')
    @HttpCode(204)
    //Swagger
    @ApiOperation({ summary: 'Delete Owner' })
    @ApiOkResponse({ description: 'The resource was returned successfully' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiNotFoundResponse({ description: 'Resource not found' })
    //Fim do Swagger
    async handleDeleteOwner(@Param('id') ownerId: string) {
        const result = await this.deleteOnwer.execute({
            ownerId,
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
