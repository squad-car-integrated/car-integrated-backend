import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ApiProperty } from '@nestjs/swagger'

export interface ServiceProductsProps {
    serviceId: UniqueEntityID
    productId: UniqueEntityID
    quantity: number
}
export class ServiceProduct extends AggregateRoot<ServiceProductsProps> {
    @ApiProperty({
        example: new UniqueEntityID().toString(),
        description: 'Service id',
    })
    get serviceId() {
        return this.props.serviceId
    }
    @ApiProperty({
        example: new UniqueEntityID().toString(),
        description: 'Product id',
    })
    get productId() {
        return this.props.productId
    }
    @ApiProperty({ example: 10, description: 'Quantity of used products' })
    get quantity() {
        return this.props.quantity
    }
    static create(props: ServiceProductsProps, id?: UniqueEntityID) {
        const product = new ServiceProduct(props, id)
        return product
    }
}
