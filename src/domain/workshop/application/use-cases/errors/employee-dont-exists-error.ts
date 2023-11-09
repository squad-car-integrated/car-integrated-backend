import { UseCaseError } from '@/core/errors/use-case-error'

export class EmployeeDontExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Employee "${identifier}" dont exists`)
  }
}
