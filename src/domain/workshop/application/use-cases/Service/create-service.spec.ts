import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository"
import { CreateServiceUseCase } from "./create-service"
import {faker} from "@faker-js/faker"
import { makeOwner } from "test/factories/make-owner"
import { makeEmployee } from "test/factories/make-employee"
import { makeAutomobile } from "test/factories/make-automobile"
import { ServiceStatus } from "@/core/entities/service-status-enum"
import { InMemoryServiceProductsRepository } from "test/repositories/in-memory-service-products-repository"

let inMemoryServicesRepository: InMemoryServicesRepository
let inMemoryServiceProductsRepository: InMemoryServiceProductsRepository
let sut: CreateServiceUseCase

describe("Create Service", () => {
    beforeEach(() => {
        inMemoryServiceProductsRepository = new InMemoryServiceProductsRepository()
        inMemoryServicesRepository = new InMemoryServicesRepository(inMemoryServiceProductsRepository);
        sut = new CreateServiceUseCase(inMemoryServicesRepository)
    })

    it("Should be able to create a service", async () => {
        const owner = makeOwner()
        const employee = makeEmployee()
        const automobile = makeAutomobile()
        const result = await sut.execute({
            totalValue: faker.number.int(),
            ownerId: owner.id.toString(),
            employeesIds: [employee.id.toString()],
            automobileId: automobile.id.toString(),
            description: faker.commerce.productDescription(),
            status: ServiceStatus.InProgress,
            productsIds: ["1", "2"]
            
        })
        expect(result.isRight()).toBe(true)
        expect(inMemoryServicesRepository.items[0]).toEqual(result.value?.service)
    })
})
