import { authApi } from "src/api/requests/api-requests"
import { AppThunk } from "src/redux/store/types"

import { sessionReducerSetIsLoading, sessionReducerSetPermissions } from ".."

export const fetchPermissions = (): AppThunk => (
  async dispatch => {
    dispatch(sessionReducerSetIsLoading(true))
    const permissions = await authApi.getPermissions()
    if (permissions) dispatch(sessionReducerSetPermissions(permissions))
    dispatch(sessionReducerSetIsLoading(false))
  }
)
