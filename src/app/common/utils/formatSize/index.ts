const formatNumbersInTriads = (value: string): string => {
  const integerPart = value.split('.').slice(0, -1)[0]
  const fractionalPart = value.split('.').slice(-1)[0]
  const integerPartInTriad = integerPart.replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
  return integerPartInTriad + '.' + fractionalPart
}

export const formatSize = (sizeInt: number) => `${formatNumbersInTriads((sizeInt / 1000000).toFixed(3))} Mb`
