import { Product } from '@/domain/workshop/enterprise/entities/product'

export class ProductPresenter {
    static toHTTP(product: Product) {
        return {
            id: product.id.toString(),
            name: product.name,
            unitValue: product.unitValue,
            productAmount: product.productAmount,
            description: product.description,
            photo: product.photo,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        }
    }
}
