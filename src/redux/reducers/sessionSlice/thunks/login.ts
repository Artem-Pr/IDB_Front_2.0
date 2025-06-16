import { jwtDecode } from 'jwt-decode'

import { authApi } from 'src/api/requests/api-requests'
import type { TokenPayload } from 'src/api/types/response-types'
import type { AppThunk } from 'src/redux/store/types'

import { sessionReducerSetExpiration, sessionReducerSetIsLoading, sessionReducerSetUserId } from '..'

import { setAllTokens } from './setAllTokens'

export const login = (
  username: string,
  password: string,
): AppThunk => (
  async dispatch => {
    dispatch(sessionReducerSetIsLoading(true))
    const response = await authApi.login(username, password)
    dispatch(setAllTokens(response))
    const accessToken = response?.accessToken
    if (accessToken) {
      const decodedToken = jwtDecode<TokenPayload>(accessToken)
      
      dispatch(sessionReducerSetExpiration(decodedToken.exp))
      dispatch(sessionReducerSetUserId(decodedToken.sub))
    }
    dispatch(sessionReducerSetIsLoading(false))
  }
)
