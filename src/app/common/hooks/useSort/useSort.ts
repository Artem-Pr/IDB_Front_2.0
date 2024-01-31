import { useSelector } from 'react-redux'

import type { RootState } from '../../../../redux/store/rootReducer'
import { useCurrentPage } from '../hooks'
import { sort } from '../../../../redux/selectors'

export const useSort = () => {
  const { isMainPage, isUploadingPage } = useCurrentPage()
  return useSelector((state: RootState) => sort(state, { isMainPage, isUploadingPage }))
}
