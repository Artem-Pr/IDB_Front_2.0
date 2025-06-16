import { useSelector, useDispatch } from 'react-redux'

import { jwtDecode } from 'jwt-decode'

import type { TokenPayload } from 'src/api/types/response-types'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from 'src/common/localStorageService'
import { sessionReducerSetAccessToken, sessionReducerSetExpiration, sessionReducerSetRefreshToken, sessionReducerSetUserId } from 'src/redux/reducers/sessionSlice'
import { getSessionReducerAccessToken } from 'src/redux/reducers/sessionSlice/selectors'

export const useIsAuthenticated = () => {
  const dispatch = useDispatch()
  const accessTokenFromState = useSelector(getSessionReducerAccessToken)

  const syncTokensWithLocalStorage = (accessToken: string) => {
    if (!accessTokenFromState && accessToken) {
      dispatch(sessionReducerSetAccessToken(accessToken))
      dispatch(sessionReducerSetRefreshToken(getRefreshTokenFromLocalStorage()))
      const decodedToken = jwtDecode<TokenPayload>(accessToken)
      dispatch(sessionReducerSetExpiration(decodedToken.exp))
      dispatch(sessionReducerSetUserId(decodedToken.sub))
    }
  }

  const accessToken = accessTokenFromState || getAccessTokenFromLocalStorage()
  syncTokensWithLocalStorage(accessToken)

  return Boolean(accessToken)
}
