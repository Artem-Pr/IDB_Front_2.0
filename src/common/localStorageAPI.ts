import { LocalStorageSession } from 'src/redux/store/localStorageSync'

const safetyJSONParse = <T>(str: string | null): T | null => {
  try {
    return str ? (JSON.parse(str) as T) : null
  } catch (e) {
    return null
  }
}

export const localStorageAPI = {
  set IDBaseSession(IDBaseSession: LocalStorageSession | null) {
    localStorage.setItem('IDBaseSession', JSON.stringify(IDBaseSession))
  },
  get IDBaseSession() {
    const IDBaseSessionJSON = localStorage.getItem('IDBaseSession')
    return safetyJSONParse(IDBaseSessionJSON)
  },
}
