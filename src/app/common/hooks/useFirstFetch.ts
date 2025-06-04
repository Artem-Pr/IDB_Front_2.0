import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { mainApi } from 'src/api/api'
import { getFolderReducerFolderPathsArr } from 'src/redux/reducers/foldersSlice/selectors'
import { fetchPathsList } from 'src/redux/reducers/foldersSlice/thunks'
import { getSessionReducerIsCurrentPage } from 'src/redux/reducers/sessionSlice/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { errorMessage } from '../notifications'

export const useFirstFetch = () => {
  const dispatch = useAppDispatch()
  const { isLoginPage } = useSelector(getSessionReducerIsCurrentPage)
  const directoriesArr = useSelector(getFolderReducerFolderPathsArr)
  const [isTempCleaned, setIsTempCleaned] = useState(false)

  useEffect(() => {
    if (isTempCleaned || isLoginPage) return

    setIsTempCleaned(true)

    mainApi
      .cleanTemp()
      .catch(err => {
        console.error(err)
        errorMessage(err, 'cleaning temp error', 0)
      })
  }, [isTempCleaned, isLoginPage])

  useEffect(() => {
    if (isLoginPage) return

    !directoriesArr.length && dispatch(fetchPathsList())
  }, [dispatch, directoriesArr, isLoginPage])
}
