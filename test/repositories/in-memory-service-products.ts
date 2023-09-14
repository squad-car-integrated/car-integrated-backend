import { PaginationParams } from "@/core/repositories/pagination-params";
import { ServiceProductsRepository } from "@/domain/workshop/application/repositories/service-products-repository";
import { ServiceProducts } from "@/domain/workshop/enterprise/entities/service-products";

export class InMemoryServiceProductssRepository implements ServiceProductsRepository {
    public items: ServiceProducts[] = [];

    async create(serviceProducts: ServiceProducts) {
        this.items.push(serviceProducts);
    }
    async findById(id: string){
        const serviceproducts = this.items.find(item => item.id.toString() === id);
        if(!serviceproducts){
            return null
        }
        return serviceproducts
    }
    async findManyByServiceId(serviceId: string, {page}: PaginationParams) {
        const serviceProductss = this.items.filter(item => item.serviceId.toString() === serviceId).slice((page - 1) * 20, page * 20)
        return serviceProductss
    }
    async delete(serviceProducts: ServiceProducts) {
        const itemIndex = this.items.findIndex(item => item.id === serviceProducts.id)
        this.items.splice(itemIndex, 1)
    }
}