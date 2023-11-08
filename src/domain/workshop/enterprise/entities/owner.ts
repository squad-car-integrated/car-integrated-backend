import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from './user'
import { Optional } from '@/core/types/optional'
import { ApiProperty } from '@nestjs/swagger'
export interface OwnerProps extends UserProps {
  phoneNumber: string
}

export class Owner extends User<OwnerProps> {
  @ApiProperty({ example: "21 99999-8888", description: 'Owner phone number' })
  get phoneNumber() {
    return this.props.phoneNumber
  }
  set phoneNumber(phoneNumber: string) {
    this.props.phoneNumber = phoneNumber
    this.touch()
  }
  static create(
    props: Optional<OwnerProps, 'createdAt' >,
    id?: UniqueEntityID,
  ) {
    const owner = new Owner(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return owner
  }
}
