import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ServiceProductList } from './service-product-list'
import { ServiceStatus } from '@/core/entities/service-status-enum'
import { ServiceEmployeeList } from './service-employee-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { ApiProperty } from '@nestjs/swagger'

export interface ServiceProps {
    automobileId: UniqueEntityID
    ownerId: UniqueEntityID
    employees: ServiceEmployeeList
    products: ServiceProductList
    laborValue: number
    productsTotalValue: number
    description: string
    status: ServiceStatus
    createdAt: Date
    updatedAt?: Date | null
}
export class Service extends AggregateRoot<ServiceProps> {
    @ApiProperty({
        example: new UniqueEntityID().toString(),
        description: 'automobile id',
    })
    get automobileId() {
        return this.props.automobileId
    }
    @ApiProperty({
        example: new UniqueEntityID().toString(),
        description: 'owner id',
    })
    get ownerId() {
        return this.props.ownerId
    }
    @ApiProperty({
        example: [new UniqueEntityID().toString()],
        description: 'Employees ids',
    })
    get employees() {
        return this.props.employees
    }
    @ApiProperty({
        example: [{ productId: new UniqueEntityID().toString(), quantity: 10 }],
        description: 'Products used in the service',
    })
    get products() {
        return this.props.products
    }
    @ApiProperty({ example: 3899, description: 'Total cost of the labor service' })
    get laborValue() {
        return this.props.laborValue
    }
    @ApiProperty({ example: 3899, description: 'Total cost of the service the products' })
    get productsTotalValue() {
        return this.props.productsTotalValue
    }
    @ApiProperty({
        example: 'Revisão completa',
        description: 'Description of the servicee',
    })
    get description() {
        return this.props.description
    }
    @ApiProperty({
        example: ServiceStatus.Completed,
        description: 'Status of the service',
    })
    get status() {
        return this.props.status
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
    set products(products: ServiceProductList) {
        this.props.products = products
        this.touch()
    }
    set employees(employees: ServiceEmployeeList) {
        this.props.employees = employees
        this.touch()
    }
    set laborValue(laborValue: number) {
        this.props.laborValue = laborValue
        this.touch()
    }
    set productsTotalValue(productsTotalValue: number) {
        this.props.productsTotalValue = productsTotalValue
        this.touch()
    }
    set description(description: string) {
        this.props.description = description
        this.touch()
    }
    set status(status: ServiceStatus) {
        this.props.status = status
        this.touch()
    }
    set automobileId(automobileId: UniqueEntityID) {
        this.props.automobileId = automobileId
        this.touch()
    }
    set ownerId(ownerId: UniqueEntityID) {
        this.props.ownerId = ownerId
        this.touch()
    }

    static create(
        props: Optional<
            ServiceProps,
            | 'createdAt'
            | 'productsTotalValue'
            | "laborValue"
            | 'description'
            | 'products'
            | 'employees'
        >,
        id?: UniqueEntityID,
    ) {
        const service = new Service(
            {
                ...props,
                productsTotalValue: props.productsTotalValue ?? 0,
                laborValue: props.laborValue ?? 0,
                description: props.description ?? '',
                employees: props.employees ?? new ServiceEmployeeList(),
                products: props.products ?? new ServiceProductList(),
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )
        return service
    }
}
