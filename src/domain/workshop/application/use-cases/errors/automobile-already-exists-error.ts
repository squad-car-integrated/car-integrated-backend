import { UseCaseError } from '@/core/errors/use-case-error'

export class AutomobileAlreadyExistsError
    extends Error
    implements UseCaseError
{
    constructor(identifier: string) {
        super(`Automobile "${identifier}" already exists`)
    }
}
