import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeService } from "test/factories/make-service";
import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository";
import { DeleteServiceUseCase } from "./delete-service";

let inMemoryServicesRepository: InMemoryServicesRepository
let sut: DeleteServiceUseCase

describe("Delete Service", () => {
    beforeEach(() => {
        inMemoryServicesRepository = new InMemoryServicesRepository();
        sut = new DeleteServiceUseCase(inMemoryServicesRepository)
    })

    it("Should be able to delete a service", async () => {
        const newService = makeService({}, new UniqueEntityID("service-1"))
        await inMemoryServicesRepository.create(newService)
        await sut.execute({
            serviceId: "service-1",
        })
        expect(inMemoryServicesRepository.items).toHaveLength(0)
    })
})