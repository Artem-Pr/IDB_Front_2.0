export const safetyJSONParse = <T>(str: string | null | undefined): T | null => {
  try {
    return str ? (JSON.parse(str) as T) : null
  } catch (e) {
    return null
  }
}
