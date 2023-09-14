import { PaginationParams } from "@/core/repositories/pagination-params"
import { ServiceProducts } from "../../enterprise/entities/service-products"

export interface ServiceProductsRepository {
    create(serviceProducts: ServiceProducts): Promise<void>
    findById(id: string): Promise<ServiceProducts | null>
    findManyByServiceId(serviceId: string, params: PaginationParams): Promise<ServiceProducts[]>
    delete(serviceProducts: ServiceProducts): Promise<void>
}