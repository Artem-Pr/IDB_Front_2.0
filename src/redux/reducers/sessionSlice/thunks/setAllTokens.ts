import type { AuthTokens } from "src/api/types/response-types"
import { saveTokensInLocalStorage } from "src/common/localStorageService"
import type { AppThunk } from "src/redux/store/types"

import { sessionReducerSetAccessToken, sessionReducerSetRefreshToken } from ".."

export const setAllTokens = (tokens: AuthTokens | undefined): AppThunk => (
  dispatch => {
    if (tokens) {
      dispatch(sessionReducerSetAccessToken(tokens.accessToken))
      dispatch(sessionReducerSetRefreshToken(tokens.refreshToken))
      saveTokensInLocalStorage(tokens)
    }
  }
)
