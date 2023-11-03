import { ServiceEmployees } from '../../enterprise/entities/service-employees'

export interface ServiceEmployeesRepository {
  findManyByServiceId(serviceId: string): Promise<ServiceEmployees[]>
  deleteManyByServiceId(serviceId: string): Promise<void>
}
