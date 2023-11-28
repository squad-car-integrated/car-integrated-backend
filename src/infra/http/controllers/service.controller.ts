import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateServiceUseCase } from '@/domain/workshop/application/use-cases/Service/create-service'
import { EditServiceUseCase } from '@/domain/workshop/application/use-cases/Service/edit-service'
import { FetchRecentServicesUseCase } from '@/domain/workshop/application/use-cases/Service/fetch-recent-services'
import { GetServiceByIdUseCase } from '@/domain/workshop/application/use-cases/Service/get-service-by-id'
import { ServicePresenter } from '../presenters/service-presenter'
import { ServiceStatus } from '@/core/entities/service-status-enum'
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiUnprocessableEntityResponse,
    ApiBody,
    ApiOkResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger'
import { Service } from '@/domain/workshop/enterprise/entities/service'
const serviceProducts = z.object({
    productId: z.string().uuid(),
    quantity: z.number().default(1),
})
const serviceCreateSchema = z.object({
    automobileId: z.string().uuid(),
    ownerId: z.string().uuid(),
    description: z.string(),
    laborValue: z.number().default(0),
    employees: z.array(z.string().uuid()),
    products: z.array(serviceProducts),
})
const serviceEditSchema = z.object({
    automobileId: z.string().uuid(),
    ownerId: z.string().uuid(),
    description: z.string(),
    status: z.nativeEnum(ServiceStatus),
    laborValue: z.number().default(0),
    employees: z.array(z.string().uuid()),
    products: z.array(serviceProducts),
})
const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type ServiceBodyCreateSchema = z.infer<typeof serviceCreateSchema>
type ServiceBodyEditSchema = z.infer<typeof serviceEditSchema>
@Controller('/services')
@ApiTags('CarIntegrated')
@ApiBearerAuth('defaultBearerAuth')
export class ServiceController {
    constructor(
        private createService: CreateServiceUseCase,
        private fetchRecentServices: FetchRecentServicesUseCase,
        private getServiceById: GetServiceByIdUseCase,
        private editService: EditServiceUseCase,
    ) {}
    @Get()
    @ApiOperation({ summary: 'Fetch services by page' })
    async handleFetchRecentServices(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    ) {
        const result = await this.fetchRecentServices.execute({ page })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
        const services = result.value.services
        const pages = result.value.totalPages
        return {
            services: services.map(ServicePresenter.toHTTP),
            pages
        }
    }
    @Get('/:id')
    //Swagger
    @ApiOperation({ summary: 'Find service by id' })
    @ApiResponse({
        status: 200,
        description: 'Service found',
        type: Service,
    })
    //Fim do Swagger
    async handleGetServiceByid(@Param('id') serviceId: string) {
        const result = await this.getServiceById.execute({ id: serviceId })
        if (result.isLeft()) {
            throw new BadRequestException(result.value?.message)
        }
        return {
            service: ServicePresenter.toHTTP(result.value.service),
        }
    }
    @Post()
    @HttpCode(201)
    //Swagger
    @ApiOperation({ summary: 'Create Service' })
    @ApiResponse({
        status: 201,
        description: 'Created Service',
        type: Service,
    })
    @ApiCreatedResponse({ description: 'Created Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiBody({
        type: Service,
        description: 'Json structure for Service object',
    })
    //Fim do Swagger
    async handlePostService(
        @Body(new ZodValidationPipe(serviceCreateSchema))
        body: ServiceBodyCreateSchema,
    ) {
        const {
            automobileId,
            ownerId,
            description,
            laborValue,
            employees,
            products,
        } = body
        const result = await this.createService.execute({
            automobileId,
            ownerId,
            description,
            status: ServiceStatus.Created,
            employees,
            products,
            laborValue,
        })
        if (result.isLeft()) {
            throw new BadRequestException(result.value?.message)
        }
    }
    @Put('/:id')
    @HttpCode(204)
    //Swagger
    @ApiOperation({ summary: 'Edit Service by id' })
    @ApiOkResponse({ description: 'The resource was updated successfully' })
    @ApiNotFoundResponse({ description: 'Resource not found' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiBody({
        type: Service,
        description: 'Json structure for user object',
    })
    @ApiResponse({
        status: 200,
        description: 'Service edited',
        type: Service,
    })
    //Fim do Swagger
    async handleEditService(
        @Body(new ZodValidationPipe(serviceEditSchema))
        body: ServiceBodyEditSchema,
        @Param('id') serviceId: string,
    ) {
        const {
            automobileId,
            ownerId,
            description,
            status,
            laborValue,
            employees,
            products,
        } = body
        const result = await this.editService.execute({
            serviceId,
            automobileId,
            ownerId,
            description,
            status,
            employees,
            products,
            laborValue,
        })
        if (result.isLeft()) {
            throw new BadRequestException(result.value?.message)
        }
    }
}
