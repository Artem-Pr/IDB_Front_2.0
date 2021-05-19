export const dateFormat = 'YYYY.MM.DD'

export const copyByJSON = (obj: any) => JSON.parse(JSON.stringify(obj))
export const removeExtraSlash = (value: string): string => (value.endsWith('/') ? value.slice(0, -1) : value)

export const getNameParts = (fullName: string) => {
  const getNameObj = (fullName: string) => {
    const separatedNameArr = fullName.split('.')
    const shortName = separatedNameArr.slice(0, -1).join('.')
    const ext = '.' + separatedNameArr[separatedNameArr.length - 1]
    return { shortName, ext }
  }
  const isValidName = fullName && fullName !== '-'
  return isValidName ? getNameObj(fullName) : { shortName: '-', ext: '' }
}
