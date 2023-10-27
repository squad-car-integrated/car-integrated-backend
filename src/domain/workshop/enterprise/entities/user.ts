import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Entity } from '@/core/entities/entity'
export interface UserProps {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
}
export abstract class User<Props extends UserProps> extends AggregateRoot<Props> {
  get name() {
    return this.props.name
  }
  get email() {
    return this.props.email
  }
  get password() {
    return this.props.password
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }
  set name(name: string) {
    this.props.name = name
    this.touch()
  }
  set email(email: string) {
    this.props.email = email
    this.touch()
  }
  set password(password: string) {
    this.props.password = password
    this.touch()
  }
  touch() {
    this.props.updatedAt = new Date()
  }
}
