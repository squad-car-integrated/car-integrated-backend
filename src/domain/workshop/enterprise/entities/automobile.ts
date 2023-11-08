import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ApiProperty } from '@nestjs/swagger'

export interface AutomobileProps {
  model: string
  brand: string
  plate: string
  ownerId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}
export class Automobile extends AggregateRoot<AutomobileProps> {
  @ApiProperty({ example: "Civic", description: 'The model of the Car' })
  get model() {
    return this.props.model
  }
  @ApiProperty({ example: "Honda", description: 'The brand of the Car' })
  get brand() {
    return this.props.brand
  }
  @ApiProperty({ example: "KZA2121B", description: 'The plate of the Car' })
  get plate() {
    return this.props.plate
  }
  @ApiProperty({ example: new UniqueEntityID().toString(), description: 'The ownerId of the Car' })
  get ownerId() {
    return this.props.ownerId
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }
  set model(model: string){
    this.props.model = model
    this.touch()
  }
  set brand(brand: string){
    this.props.brand = brand
    this.touch()
  }
  set plate(plate: string){
    this.props.plate = plate
    this.touch()
  }
  set ownerId(ownerId: UniqueEntityID){
    this.props.ownerId = ownerId
    this.touch()
  }
  private touch() {
    this.props.updatedAt = new Date()
  }
  static create(
    props: Optional<AutomobileProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const automobile = new Automobile(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return automobile
  }
}
