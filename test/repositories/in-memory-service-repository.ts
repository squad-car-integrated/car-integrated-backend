import { PaginationParams } from "@/core/repositories/pagination-params";
import { ServicesRepository } from "@/domain/workshop/application/repositories/services-repository";
import { Service } from "@/domain/workshop/enterprise/entities/services";

export class InMemoryServicesRepository implements ServicesRepository {
    async findManyRecent({page}: PaginationParams) {
        const services = this.items
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice((page - 1) * 20, page * 20)
        return services
    }
    public items: Service[] = [];
    async findById(id: string){
        const service = this.items.find(item => item.id.toString() === id);
        if(!service){
            return null
        }
        return service
    }
    async create(service: Service) {
        this.items.push(service);
    }
    async save(service: Service){
        const itemIndex = this.items.findIndex(item => item.id === service.id)
        this.items[itemIndex] = service
    }
    async delete(service: Service) {
        const itemIndex = this.items.findIndex(item => item.id === service.id)
        this.items.splice(itemIndex, 1)
    }
}