import { makeService } from 'test/factories/make-service'
import { InMemoryServicesRepository } from 'test/repositories/in-memory-services-repository'
import { GetServiceByIdUseCase } from './get-service-by-id'

let inMemoryServicesRepository: InMemoryServicesRepository
let sut: GetServiceByIdUseCase

describe('Get Service By Id', () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository()
    sut = new GetServiceByIdUseCase(inMemoryServicesRepository)
  })

  it('Should be able to get a service by id', async () => {
    const newService = makeService({})
    await inMemoryServicesRepository.create(newService)
    const result = await sut.execute({
      id: newService.id.toString(),
    })
    expect(result.value).toBeTruthy()
  })
})
