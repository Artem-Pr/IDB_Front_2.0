import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getSessionReducerPermissions } from 'src/redux/reducers/sessionSlice/selectors'
// import { fetchPermissions } from 'src/redux/reducers/sessionSlice/thunks'
import { useAppDispatch } from 'src/redux/store/store'

export const usePermissions = (isAuth: boolean) => {
  const permissions = useSelector(getSessionReducerPermissions)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isAuth && permissions.length === 0) {
    //   dispatch(fetchPermissions())
    }
  }, [dispatch, isAuth, permissions.length])
  
  return permissions
}
