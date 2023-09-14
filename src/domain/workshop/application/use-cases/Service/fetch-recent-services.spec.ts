import { makeService } from "test/factories/make-service"
import { InMemoryServicesRepository } from "test/repositories/in-memory-services-repository"
import { FetchRecentServicesUseCase } from "./fetch-recent-services"
import { InMemoryServiceProductsRepository } from "test/repositories/in-memory-service-products-repository"

let inMemoryServicesRepository: InMemoryServicesRepository
let inMemoryServiceProductsRepository: InMemoryServiceProductsRepository
let sut: FetchRecentServicesUseCase

describe("Fetch recent services", () => {
    beforeEach(() => {
        inMemoryServiceProductsRepository = new InMemoryServiceProductsRepository()
        inMemoryServicesRepository = new InMemoryServicesRepository(inMemoryServiceProductsRepository);
        sut = new FetchRecentServicesUseCase(inMemoryServicesRepository)
    })

    it("Should be able to fetch recent services", async () => {
        await inMemoryServicesRepository.create(makeService({createdAt: new Date(2022,0,20)}))
        await inMemoryServicesRepository.create(makeService({createdAt: new Date(2022,0,18)}))
        await inMemoryServicesRepository.create(makeService({createdAt: new Date(2022,0,23)}))

        const result = await sut.execute({
            page: 1
        })
        expect(result.value?.services).toEqual([
            expect.objectContaining({createdAt: new Date(2022,0,23)}),
            expect.objectContaining({createdAt: new Date(2022,0,20)}),
            expect.objectContaining({createdAt: new Date(2022,0,18)})
        ])
    })
    it("Should be able to fetch paginated recent services", async () => {
        for (let i = 1; i<= 22; i++){
            await inMemoryServicesRepository.create(makeService())
        }
        const result = await sut.execute({
            page: 2
        })
        expect(result.value?.services).toHaveLength(2)
    })
})
