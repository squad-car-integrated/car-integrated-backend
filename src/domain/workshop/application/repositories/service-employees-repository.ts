import { ServiceEmployee } from '../../enterprise/entities/service-employees'

export abstract class ServiceEmployeesRepository {
  abstract create(serviceEmployee: ServiceEmployee): Promise<void>
  abstract findManyByServiceId(serviceId: string): Promise<ServiceEmployee[]>
  abstract deleteManyByServiceId(serviceId: string): Promise<void>
}
