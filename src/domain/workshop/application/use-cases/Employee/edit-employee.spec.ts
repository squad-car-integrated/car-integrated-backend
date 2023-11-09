import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeEmployee } from 'test/factories/make-employee'
import { InMemoryEmployeesRepository } from 'test/repositories/in-memory-employees-repository'
import { EditEmployeeUseCase } from './edit-employee'

let inMemoryEmployeesRepository: InMemoryEmployeesRepository
let sut: EditEmployeeUseCase

describe('Edit Employee', () => {
    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        sut = new EditEmployeeUseCase(inMemoryEmployeesRepository)
    })

    it('Should be able to edit a employee', async () => {
        const newEmployee = makeEmployee({}, new UniqueEntityID('employee-1'))
        await inMemoryEmployeesRepository.create(newEmployee)
        await sut.execute({
            employeeId: newEmployee.id.toString(),
            email: newEmployee.email,
            name: 'Nome editado',
            password: newEmployee.password,
            monthWorkedHours: newEmployee.monthWorkedHours,
        })
        expect(inMemoryEmployeesRepository.items[0]).toMatchObject({
            name: 'Nome editado',
        })
    })
})
