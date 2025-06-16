import { authApi } from "src/api/requests/api-requests"
import { removeTokensFromLocalStorage } from "src/common/localStorageService"
import type { AppThunk } from "src/redux/store/types"

import { 
  sessionReducerRemoveAccessToken,
  sessionReducerRemovePermissions,
  sessionReducerRemoveRefreshToken,
  sessionReducerSetIsLoading 
} from ".."
import { mainPageReducerClearState } from "../../mainPageSlice"
import { uploadReducerClearState, uploadReducerSetShowUppyUploaderModal } from "../../uploadSlice"
import { getSessionReducerAuth } from "../selectors"

export const logout = (): AppThunk => (
  (dispatch, getState) => {
    const { refreshToken, accessToken } = getSessionReducerAuth(getState())

    dispatch(sessionReducerSetIsLoading(false))
    dispatch(sessionReducerRemoveAccessToken())
    dispatch(sessionReducerRemoveRefreshToken())
    dispatch(sessionReducerRemovePermissions())
    dispatch(uploadReducerSetShowUppyUploaderModal(false))
    dispatch(uploadReducerClearState())
    dispatch(mainPageReducerClearState())

    authApi.logout({ refreshToken, accessToken })
    removeTokensFromLocalStorage()
  }
)
