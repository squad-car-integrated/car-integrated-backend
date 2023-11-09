import { WatchedList } from '@/core/entities/watched-list'
import { ServiceEmployee } from './service-employees'
type ServiceEmployeeString = {
    id: string
    serviceId: string
    employeeId: string
}
export class ServiceEmployeeList extends WatchedList<ServiceEmployee> {
    compareItems(a: ServiceEmployee, b: ServiceEmployee): boolean {
        return a.employeeId === b.employeeId
    }
    listToString() {
        const newList: ServiceEmployeeString[] = []
        this.currentItems.map((item) => {
            newList.push({
                id: item.id.toString(),
                serviceId: item.serviceId.toString(),
                employeeId: item.employeeId.toString(),
            })
        })
        return newList
    }
}
