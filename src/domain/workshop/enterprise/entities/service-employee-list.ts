import { WatchedList } from '@/core/entities/watched-list'
import { ServiceEmployee } from './service-employees'

export class ServiceEmployeeList extends WatchedList<ServiceEmployee> {
  compareItems(a: ServiceEmployee, b: ServiceEmployee): boolean {
    return a.employeeId === b.employeeId
  }
}
