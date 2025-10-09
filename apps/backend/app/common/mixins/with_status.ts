import { type BaseModel, column } from '@adonisjs/lucid/orm'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'

type ModelWithStatusRow<TStatus extends readonly string[]> = {
  status: TStatus[number]
}

type ModelWithStatusClass<
  TStatus extends readonly string[],
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  new (...args: any[]): ModelWithStatusRow<TStatus>
}

export function withStatuses<const TStatus extends readonly string[]>(_statusValues: TStatus) {
  return <T extends NormalizeConstructor<typeof BaseModel>>(
    superclass: T
  ): ModelWithStatusClass<TStatus, T> => {
    class ModelWithStatus extends superclass {
      @column()
      declare status: TStatus[number]
    }

    return ModelWithStatus as unknown as ModelWithStatusClass<TStatus, T>
  }
}
