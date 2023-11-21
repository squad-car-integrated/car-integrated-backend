import { WatchedList } from '@/core/entities/watched-list'
import { ServiceEmployee } from './service-employees'
type ServiceEmployeeString = {
    id: string
    employeeId: string
}
export class ServiceEmployeeList extends WatchedList<ServiceEmployee> {
    compareItems(a: ServiceEmployee, b: ServiceEmployee): boolean {
        return a.employeeId === b.employeeId
    }
    listToString(): ServiceEmployeeString[] {
        const newList: ServiceEmployeeString[] = []
        this.currentItems.forEach(employee => {
            newList.push({
                id: employee.id.toString(),
                employeeId: employee.employeeId.toString(),
            })
        });
        return newList
    }
}
