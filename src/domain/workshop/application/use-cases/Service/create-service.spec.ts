import { InMemoryServicesRepository } from "test/repositories/in-memory-service-repository"
//import { CreateServiceUseCase } from "./create-service"
import {faker} from "@faker-js/faker"
import { makeOwner } from "test/factories/make-owner"


let inMemoryServicesRepository: InMemoryServicesRepository
//let sut: CreateServiceUseCase

// describe("Create Service", () => {
//     beforeEach(() => {
//         inMemoryServicesRepository = new InMemoryServicesRepository();
//         sut = new CreateServiceUseCase(inMemoryServicesRepository)
//     })

//     it("Should be able to create a service", async () => {
//         // const owner = makeOwner()
//         // const result = await sut.execute({
//         //     totalValue: faker.number.int(),
//         //     ownerId: owner.id.toString(),
//         //     employeesIds: ["1", "2", "3"],
//         //     automobileId: automobile.id.toString(),
//         //     description: faker.commerce.productDescription(),
//         //     status: ServiceStatus.Completed(),
//         //     products: 
            
//         // })
//         expect(result.isRight()).toBe(true)
//         expect(inMemoryServicesRepository.items[0]).toEqual(result.value?.service)
//     })
// })
