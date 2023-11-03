import { Either, left, right } from '@/core/either'
import { Service } from '@/domain/workshop/enterprise/entities/service'
import { ServicesRepository } from '../../repositories/services-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface GetServiceByIdUseCaseRequest {
  id: string
}
type GetServiceByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { service: Service }
>
@Injectable()
export class GetServiceByIdUseCase {
  constructor(private serviceRepository: ServicesRepository) {}
  async execute({
    id,
  }: GetServiceByIdUseCaseRequest): Promise<GetServiceByIdUseCaseResponse> {
    const service = await this.serviceRepository.findById(id)
    if (!service) {
      return left(new ResourceNotFoundError())
    }
    return right({
      service,
    })
  }
}
