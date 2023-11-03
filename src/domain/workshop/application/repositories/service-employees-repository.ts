import { ServiceEmployee } from '../../enterprise/entities/service-employees'

export abstract class ServiceEmployeesRepository {
  abstract findManyByServiceId(serviceId: string): Promise<ServiceEmployee[]>
  abstract deleteManyByServiceId(serviceId: string): Promise<void>
}
