import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ApiProperty } from '@nestjs/swagger'

export interface ProductProps {
    name: string
    unitValue: number
    productAmount: number
    description: string
    photo: string
    createdAt: Date
    updatedAt?: Date
}
export class Product extends AggregateRoot<ProductProps> {
    @ApiProperty({ example: 'Oleo Motul', description: 'Product name' })
    get name() {
        return this.props.name
    }
    @ApiProperty({ example: 89.99, description: 'Unitary product value' })
    get unitValue() {
        return this.props.unitValue
    }
    @ApiProperty({ example: 100, description: 'Stock product quantity' })
    get productAmount() {
        return this.props.productAmount
    }
    @ApiProperty({
        example: 'Oleo para motores honda etc',
        description: 'Description for the product',
    })
    get description() {
        return this.props.description
    }
    @ApiProperty({
        example: 'https://img.uri',
        description: 'Uri for the photo',
    })
    get photo() {
        return this.props.photo
    }
    get createdAt() {
        return this.props.createdAt
    }
    get updatedAt() {
        return this.props.updatedAt
    }
    private touch() {
        this.props.updatedAt = new Date()
    }
    set name(name: string) {
        this.props.name = name
        this.touch()
    }
    set unitValue(unitValue: number) {
        this.props.unitValue = unitValue
        this.touch()
    }
    set productAmount(productAmount: number) {
        this.props.productAmount = productAmount
        this.touch()
    }
    set description(description: string) {
        this.props.description = description
        this.touch()
    }
    set photo(photo: string) {
        this.props.photo = photo
        this.touch()
    }
    static create(
        props: Optional<ProductProps, 'createdAt' | 'photo'>,
        id?: UniqueEntityID,
    ) {
        const product = new Product(
            {
                ...props,
                photo: props.photo ?? '',
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )
        return product
    }
}
