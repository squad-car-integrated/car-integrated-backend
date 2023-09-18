import { WatchedList } from '@/core/entities/watched-list'
import { ServiceEmployees } from './service-employees'

export class ServiceEmployeeList extends WatchedList<ServiceEmployees> {
  compareItems(a: ServiceEmployees, b: ServiceEmployees): boolean {
    return a.employeeId === b.employeeId
  }
}
