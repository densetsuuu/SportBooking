import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel> {
    fuzzySearch(columns: string[], term: string, threshold?: number): this

    fuzzySearch(relation: string, columns: string[], term: string, threshold?: number): this
  }
}

export const similarity = (columns: string[], term: string): string => {
  if (!term || !columns.length) {
    throw new Error('Both columns and term are required for similarity search')
  }

  const sanitizedTerm = term.replace(/'/g, "''")

  if (columns.length === 1) {
    return `similarity(${columns[0]}, '${sanitizedTerm}')`
  }

  // For multiple columns, use the maximum similarity
  const similarityExpressions = columns.map((column) => `similarity(${column}, '${sanitizedTerm}')`)

  return `GREATEST(${similarityExpressions.join(', ')})`
}

// Legacy function for backward compatibility
export const fuzzySearch = <T extends LucidModel>(
  query: ModelQueryBuilderContract<T>,
  columns: string[],
  term: string,
  threshold: number = 0.3
) => {
  return fuzzySearchImplementation(query, columns, term, threshold)
}

// Overloaded function for relation-based fuzzy search
export const fuzzySearchWithRelation = <T extends LucidModel>(
  query: ModelQueryBuilderContract<T>,
  relation: ExtractModelRelations<InstanceType<T>>,
  columns: string[],
  term: string,
  threshold: number = 0.3
) => {
  if (!term || !columns.length) {
    return query
  }

  const sanitizedTerm = term.replace(/'/g, "''")

  // Use whereHas to search in related table instead of direct column references
  return query.whereHas(relation, (relatedQuery) => {
    const similarityExpression = similarity(columns, term)

    // For short terms (< 3 chars), use ILIKE as fallback since pg_trgm works better with longer terms
    if (term.length < 3) {
      const likeConditions = columns.map((column) => `${column} ILIKE '%${sanitizedTerm}%'`)
      relatedQuery.whereRaw(`(${likeConditions.join(' OR ')})`)
    } else {
      relatedQuery.whereRaw(
        `(${similarityExpression} > ?) OR (${columns.map((col) => `${col} ILIKE '%${sanitizedTerm}%'`).join(' OR ')})`,
        [threshold]
      )
    }

    return relatedQuery.orderByRaw(`${similarityExpression} DESC`)
  })
}

// Core implementation function
const fuzzySearchImplementation = <T extends LucidModel>(
  query: ModelQueryBuilderContract<T>,
  columns: string[],
  term: string,
  threshold: number = 0.3
) => {
  if (!term || !columns.length) {
    return query
  }

  const sanitizedTerm = term.replace(/'/g, "''")
  const similarityExpression = similarity(columns, term)

  // For short terms (< 3 chars), use ILIKE as fallback since pg_trgm works better with longer terms
  if (term.length < 3) {
    const likeConditions = columns.map((column) => `${column} ILIKE '%${sanitizedTerm}%'`)

    return query
      .whereRaw(`(${likeConditions.join(' OR ')})`)
      .orderByRaw(`${similarityExpression} DESC`)
  }

  return query
    .whereRaw(
      `(${similarityExpression} > ?) OR (${columns.map((col) => `${col} ILIKE '%${sanitizedTerm}%'`).join(' OR ')})`,
      [threshold]
    )
    .orderByRaw(`${similarityExpression} DESC`)
}

// Extend ModelQueryBuilder prototype with fuzzySearch method
;(ModelQueryBuilder.prototype as any).fuzzySearch = function (
  this: ModelQueryBuilderContract<LucidModel>,
  columnsOrRelation: ExtractModelRelations<InstanceType<LucidModel>> | string[],
  columnsOrTerm?: string[] | string,
  termOrThreshold?: string | number,
  threshold: number = 0.3
) {
  if (Array.isArray(columnsOrRelation)) {
    const columns = columnsOrRelation
    const term = columnsOrTerm as string
    const thresholdValue = typeof termOrThreshold === 'number' ? termOrThreshold : threshold
    return fuzzySearchImplementation(this, columns, term, thresholdValue)
  } else {
    // Relation-based: fuzzySearch('user', ['firstName', 'lastName'], 'term', threshold?)
    const relation = columnsOrRelation
    const columns = columnsOrTerm as string[]
    const term = termOrThreshold as string
    return fuzzySearchWithRelation(this, relation, columns, term, threshold)
  }
}
