import { localStorageAPI } from 'src/common/localStorageAPI'
import type { State as FoldersState } from 'src/redux/reducers/foldersSlice'
import type { State as MainPageState } from 'src/redux/reducers/mainPageSlice/mainPageState'
import type { State as SessionState } from 'src/redux/reducers/sessionSlice'
import type { State as SettingsState } from 'src/redux/reducers/settingsSlice'
import type { State as UploadPageState } from 'src/redux/reducers/uploadSlice/uploadState'

import { folderReducerSetCurrentFolderInfo } from '../reducers/foldersSlice'
import {
  mainPageReducerSetGalleryPagination,
  mainPageReducerSetOpenMenus,
  mainPageReducerSetSearchMenu,
  mainPageReducerSetSort,
} from '../reducers/mainPageSlice'
import {
  sessionReducerSetAsideMenuWidth,
  sessionReducerSetCurrentPage,
  sessionReducerSetFitContain,
  sessionReducerSetIsDuplicatesChecking,
  sessionReducerSetPreviewSize,
  sessionReducerSetScrollUpWhenUpdating,
} from '../reducers/sessionSlice'
import {
  settingsReducerSetImagePreviewSlideLimits,
  settingsReducerSetIsVideoPreviewMuted,
} from '../reducers/settingsSlice'
import { uploadReducerSetSort } from '../reducers/uploadSlice'

import type { RootState, AppDispatch } from './types'

export interface LocalStorageSession {
  settingsSlice: {
    imagePreviewSlideLimits: SettingsState['imagePreviewSlideLimits'],
    isVideoPreviewMuted: SettingsState['isVideoPreviewMuted'],
  },
  sessionSlice: {
    asideMenuWidth: SessionState['asideMenuWidth'],
    currentPage: SessionState['currentPage'],
    fitContain: SessionState['fitContain'],
    isDuplicatesChecking: SessionState['isDuplicatesChecking'],
    previewSize: SessionState['previewSize'],
    scrollUpWhenUpdating: SessionState['scrollUpWhenUpdating'],
  },
  mainPageSlice: {
    openMenus: MainPageState['openMenus'],
    searchMenu: MainPageState['searchMenu'],
    galleryPagination: MainPageState['galleryPagination'],
    sort: MainPageState['sort'],
  },
  uploadPageSlice: {
    sort: UploadPageState['sort'],
  },
  foldersSlice: {
    currentFolderInfo: FoldersState['currentFolderInfo'],
  },
}

export const saveLocalStorageSession = (state: RootState) => {
  const savingSession: LocalStorageSession = {
    settingsSlice: {
      imagePreviewSlideLimits: state.settingsSliceReducer.imagePreviewSlideLimits,
      isVideoPreviewMuted: state.settingsSliceReducer.isVideoPreviewMuted,
    },
    sessionSlice: {
      asideMenuWidth: state.sessionSliceReducer.asideMenuWidth,
      currentPage: state.sessionSliceReducer.currentPage,
      fitContain: state.sessionSliceReducer.fitContain,
      isDuplicatesChecking: state.sessionSliceReducer.isDuplicatesChecking,
      previewSize: state.sessionSliceReducer.previewSize,
      scrollUpWhenUpdating: state.sessionSliceReducer.scrollUpWhenUpdating,
    },
    mainPageSlice: {
      openMenus: state.mainPageSliceReducer.openMenus,
      searchMenu: state.mainPageSliceReducer.searchMenu,
      galleryPagination: state.mainPageSliceReducer.galleryPagination,
      sort: state.mainPageSliceReducer.sort,
    },
    uploadPageSlice: {
      sort: state.uploadPageSliceReducer.sort,
    },
    foldersSlice: {
      currentFolderInfo: state.foldersSliceReducer.currentFolderInfo,
    },
  }

  localStorageAPI.IDBaseSession = savingSession
}

// TODO: add validation
export const setDefaultStore = (dispatch: AppDispatch) => {
  const localStorageSession = localStorageAPI.IDBaseSession

  if (!localStorageSession) return

  dispatch(folderReducerSetCurrentFolderInfo(localStorageSession.foldersSlice.currentFolderInfo))

  dispatch(mainPageReducerSetGalleryPagination(localStorageSession.mainPageSlice.galleryPagination))
  dispatch(mainPageReducerSetOpenMenus(localStorageSession.mainPageSlice.openMenus))
  dispatch(mainPageReducerSetSearchMenu(localStorageSession.mainPageSlice.searchMenu))
  dispatch(mainPageReducerSetSort(localStorageSession.mainPageSlice.sort))

  dispatch(sessionReducerSetAsideMenuWidth(localStorageSession.sessionSlice.asideMenuWidth))
  dispatch(sessionReducerSetCurrentPage(localStorageSession.sessionSlice.currentPage))
  dispatch(sessionReducerSetFitContain(localStorageSession.sessionSlice.fitContain))
  dispatch(sessionReducerSetIsDuplicatesChecking(localStorageSession.sessionSlice.isDuplicatesChecking))
  dispatch(sessionReducerSetPreviewSize(localStorageSession.sessionSlice.previewSize))
  dispatch(sessionReducerSetScrollUpWhenUpdating(localStorageSession.sessionSlice.scrollUpWhenUpdating))

  dispatch(settingsReducerSetImagePreviewSlideLimits(localStorageSession.settingsSlice.imagePreviewSlideLimits))
  dispatch(settingsReducerSetIsVideoPreviewMuted(localStorageSession.settingsSlice.isVideoPreviewMuted))

  dispatch(uploadReducerSetSort(localStorageSession.uploadPageSlice.sort))
}
