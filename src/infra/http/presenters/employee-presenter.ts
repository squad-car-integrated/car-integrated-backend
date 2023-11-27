import { Employee } from '@/domain/workshop/enterprise/entities/employee'

export class EmployeePresenter {
    static toHTTP(employee: Employee) {
        return {
            id: employee.id.toString(),
            name: employee.name,
            email: employee.email,
            monthWorkedHours: employee.monthWorkedHours,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt,
        }
    }
}
