import { useSelector } from 'react-redux'

import { sort } from '../../../../redux/selectors'
import type { RootState } from '../../../../redux/store/types'
import { useCurrentPage } from '../hooks'

export const useSort = () => {
  const { isMainPage, isUploadingPage } = useCurrentPage()
  return useSelector((state: RootState) => sort(state, { isMainPage, isUploadingPage }))
}
