import type { RootState } from 'src/redux/store/types'

export const getTestReducerNumberOfFilesChecking = (state: RootState) => state.testsSliceReducer.firstTest
