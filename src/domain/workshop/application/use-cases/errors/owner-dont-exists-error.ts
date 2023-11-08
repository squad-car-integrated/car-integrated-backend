import { UseCaseError } from '@/core/errors/use-case-error'

export class OwnerDontExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Owner "${identifier}" dont exists`)
  }
}
