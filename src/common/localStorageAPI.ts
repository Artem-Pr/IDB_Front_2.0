import { safetyJSONParse } from 'src/app/common/utils/safetyJSONParse'
import { LocalStorageSession } from 'src/redux/store/localStorageSync'

export const localStorageAPI = {
  set IDBaseSession(IDBaseSession: LocalStorageSession | null) {
    localStorage.setItem('IDBaseSession', JSON.stringify(IDBaseSession))
  },
  get IDBaseSession() {
    const IDBaseSessionJSON = localStorage.getItem('IDBaseSession')
    return safetyJSONParse(IDBaseSessionJSON)
  },
}
