import { ServiceEmployeesRepository } from '@/domain/workshop/application/repositories/service-employees-repository'
import { ServiceEmployee } from '@/domain/workshop/enterprise/entities/service-employees'

export class InMemoryServiceEmployeesRepository
    implements ServiceEmployeesRepository
{
    async save(serviceEmployee: ServiceEmployee): Promise<void> {
        const itemIndex = this.items.findIndex(
            (item) => item.id === serviceEmployee.id,
        )
        this.items[itemIndex] = serviceEmployee
    }
    async create(serviceEmployee: ServiceEmployee): Promise<void> {
        this.items.push(serviceEmployee)
    }
    async deleteManyByServiceId(serviceId: string) {
        const serviceEmployees = this.items.filter(
            (item) => item.serviceId.toString() !== serviceId,
        )
        this.items = serviceEmployees
    }
    public items: ServiceEmployee[] = []
    async findManyByServiceId(serviceId: string) {
        const serviceEmployees = this.items.filter(
            (item) => item.serviceId.toString() === serviceId,
        )
        return serviceEmployees
    }
}
