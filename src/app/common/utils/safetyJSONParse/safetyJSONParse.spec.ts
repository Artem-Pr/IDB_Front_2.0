import { safetyJSONParse } from '.'

describe('safetyJSONParse', () => {
  it('should correctly parse valid JSON string', () => {
    const testObj = { name: 'test', value: 123 }
    const jsonString = JSON.stringify(testObj)
    expect(safetyJSONParse(jsonString))
      .toEqual(testObj)
  })

  it('should return null for null input', () => {
    expect(safetyJSONParse(null))
      .toBeNull()
  })

  it('should return null for undefined input', () => {
    expect(safetyJSONParse(undefined))
      .toBeNull()
  })

  it('should return null for invalid JSON string', () => {
    const invalidJSON = '{ invalid json }'
    expect(safetyJSONParse(invalidJSON))
      .toBeNull()
  })

  it('should correctly parse array JSON string', () => {
    const testArray = [1, 2, 3]
    const jsonString = JSON.stringify(testArray)
    expect(safetyJSONParse<number[]>(jsonString))
      .toEqual(testArray)
  })

  it('should handle empty string', () => {
    expect(safetyJSONParse(''))
      .toBeNull()
  })
})
