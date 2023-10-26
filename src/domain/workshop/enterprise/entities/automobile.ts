import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AutomobileProps {
  model: string
  brand: string
  plate: string
  ownerId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}
export class Automobile extends Entity<AutomobileProps> {
  get model() {
    return this.props.model
  }
  get brand() {
    return this.props.brand
  }
  get plate() {
    return this.props.plate
  }
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
    this.model = model
  }
  set brand(brand: string){
    this.brand = brand
  }
  set plate(plate: string){
    this.plate = plate
  }
  set ownerId(ownerId: UniqueEntityID){
    this.ownerId = ownerId
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
