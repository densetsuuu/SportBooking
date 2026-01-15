import { test } from '@japa/runner'
import { similarity } from '#common/utils/fuzzy_search'

test.group('Fuzzy Search - similarity function', () => {
  test('should generate similarity expression for a single column', ({ assert }) => {
    const result = similarity(['name'], 'test')
    assert.equal(result, "similarity(name, 'test')")
  })

  test('should generate GREATEST expression for multiple columns', ({ assert }) => {
    const result = similarity(['name', 'description'], 'test')
    assert.equal(
      result,
      "GREATEST(similarity(name, 'test'), similarity(description, 'test'))"
    )
  })

  test('should sanitize single quotes in the search term', ({ assert }) => {
    const result = similarity(['name'], "O'Connor")
    assert.equal(result, "similarity(name, 'O''Connor')")
  })

  test('should handle multiple columns with sanitized quotes', ({ assert }) => {
    const result = similarity(['firstName', 'lastName'], "O'Brien")
    assert.equal(
      result,
      "GREATEST(similarity(firstName, 'O''Brien'), similarity(lastName, 'O''Brien'))"
    )
  })

  test('should throw error when columns array is empty', ({ assert }) => {
    assert.throws(() => similarity([], 'test'), 'Both columns and term are required for similarity search')
  })

  test('should throw error when term is empty', ({ assert }) => {
    assert.throws(() => similarity(['name'], ''), 'Both columns and term are required for similarity search')
  })

  test('should handle special characters in term', ({ assert }) => {
    const result = similarity(['name'], 'test & value')
    assert.equal(result, "similarity(name, 'test & value')")
  })

  test('should handle three or more columns', ({ assert }) => {
    const result = similarity(['col1', 'col2', 'col3'], 'search')
    assert.equal(
      result,
      "GREATEST(similarity(col1, 'search'), similarity(col2, 'search'), similarity(col3, 'search'))"
    )
  })
})
