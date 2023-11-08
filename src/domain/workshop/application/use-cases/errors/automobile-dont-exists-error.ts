import { UseCaseError } from '@/core/errors/use-case-error'

export class AutomobileDontExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Automobile "${identifier}" dont exists`)
  }
}
