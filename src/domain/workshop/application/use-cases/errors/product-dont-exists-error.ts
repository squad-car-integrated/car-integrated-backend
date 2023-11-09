import { UseCaseError } from '@/core/errors/use-case-error'

export class ProductDontExistsError extends Error implements UseCaseError {
    constructor(identifier: string) {
        super(`Product "${identifier}" dont exists`)
    }
}
