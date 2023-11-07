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
import { ServiceProduct } from '@/domain/workshop/enterprise/entities/service-products'
const serviceProducts = z.object({
    productId: z.string().uuid(),
    quantity: z.number().default(1)
})
const serviceCreateSchema = z.object({
    automobileId: z.string().uuid(),
    ownerId: z.string().uuid(),
    description: z.string(),
    totalValue: z.number().default(0),
    employeesIds: z.array(z.string().uuid()),
    productsIds: z.array(serviceProducts),
})
const serviceEditSchema = z.object({
    automobileId: z.string().uuid(),
    ownerId: z.string().uuid(),
    description: z.string(),
    status: z.nativeEnum(ServiceStatus),
    totalValue: z.number().default(0),
    employeesIds: z.array(z.string().uuid()),
    productsIds: z.array(serviceProducts),
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
export class ServiceController {
    constructor(
        private createService: CreateServiceUseCase,
        private fetchRecentServices: FetchRecentServicesUseCase,
        private getServiceById: GetServiceByIdUseCase,
        private editService: EditServiceUseCase,
    ) {}
    @Get()
    async handleFetchRecentServices(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    ) {
        const result = await this.fetchRecentServices.execute({ page })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
        const services = result.value.services
        return {
            services: services.map(ServicePresenter.toHTTP),
        }
    }
    @Get('/:id')
    async handleGetServiceByid(@Param('id') serviceId: string) {
        const result = await this.getServiceById.execute({ id: serviceId })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
        return {
            service: ServicePresenter.toHTTP(result.value.service),
        }
    }
    @Post()
    @HttpCode(201)
    async handlePostService(
        @Body(new ZodValidationPipe(serviceCreateSchema)) body: ServiceBodyCreateSchema,
    ) {
        const { automobileId, ownerId, description, totalValue, employeesIds, productsIds } = body
        const result = await this.createService.execute({
            automobileId,
            ownerId,
            description,
            status: ServiceStatus.Created,
            employeesIds,
            productsIds,
            totalValue
        })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
    @Put('/:id')
    @HttpCode(204)
    async handleEditService(
        @Body(new ZodValidationPipe(serviceEditSchema)) body: ServiceBodyEditSchema,
        @Param('id') serviceId: string,
    ) {
        const { automobileId, ownerId, description, status, totalValue, employeesIds, productsIds } = body
        const result = await this.editService.execute({
            serviceId,
            automobileId,
            ownerId,
            description,
            status,
            employeesIds,
            productsIds,
            totalValue,
        })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
