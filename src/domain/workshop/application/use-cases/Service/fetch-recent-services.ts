import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ServicesRepository } from '../../repositories/services-repository'
import { Service } from '@/domain/workshop/enterprise/entities/service'
import { ServiceEmployeeList } from '@/domain/workshop/enterprise/entities/service-employee-list'
import { ServiceProductList } from '@/domain/workshop/enterprise/entities/service-product-list'
import { ServiceEmployeesRepository } from '../../repositories/service-employees-repository'
import { ServiceProductsRepository } from '../../repositories/service-products-repository'

interface FetchRecentServicesUseCaseRequest {
    page: number
}
type FetchRecentServicesUseCaseResponse = Either<null, { services: Service[], totalPages: number }>
@Injectable()
export class FetchRecentServicesUseCase {
    constructor(
        private serviceRepository: ServicesRepository,
        private serviceProductsRepository: ServiceProductsRepository,
        private serviceEmployeesRepository: ServiceEmployeesRepository,
    ) {}
    async execute({
        page,
    }: FetchRecentServicesUseCaseRequest): Promise<FetchRecentServicesUseCaseResponse> {
        const services = await this.serviceRepository.findManyRecent({ page });

        /* The code block is using `Promise.all` and `Array.map` to iterate over an array of `services`
        and perform some asynchronous operations on each service. */
        const servicesWithDetails = await Promise.all(
            services.map(async (service) => {
                const [serviceProducts, serviceEmployees] = await Promise.all([
                this.serviceProductsRepository.findManyByServiceId(service.id.toString()),
                this.serviceEmployeesRepository.findManyByServiceId(service.id.toString()),
                ]);
                service.products = new ServiceProductList(serviceProducts);
                service.employees = new ServiceEmployeeList(serviceEmployees);
            
                return service;
            }),
        );
        const totalPages = await this.serviceRepository.getNumberOfPages()
        return right({
            services: servicesWithDetails,
            totalPages
        });
    }
}
