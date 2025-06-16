import type { HttpRequest, HttpResponse } from 'tus-js-client/lib'

import { errorMessage } from 'src/app/common/notifications'
import { getSettingsReducerIsNewUploader } from 'src/redux/reducers/settingsSlice/selectors'
import { uploadReducerClearSelectedList, uploadReducerSetShowUppyUploaderModal, uploadReducerSetUploadingStatus } from 'src/redux/reducers/uploadSlice'
import { getUploadReducerFilesArr } from 'src/redux/reducers/uploadSlice/selectors'
import { addUploadingFile } from 'src/redux/reducers/uploadSlice/thunks'
import type { ReduxStore } from 'src/redux/store/types'

import { Media } from '../models/media'

import { UppyInstanceBase } from './uppyInstanceBase'
import { UppyReduxAuthentication } from './uppyReduxAuthentication'
import type { CurrentUppyFile } from './uppyTypes'

const showDuplicatesErrorMessage = (duplicateFileName: string) => {
  errorMessage(new Error(`${duplicateFileName} is already exist`), 'File is not uploaded')
}

export class UppyWithReduxWrapper extends UppyInstanceBase {
  private _reduxStore: ReduxStore | undefined = undefined

  isReduxStoreInitialized() {
    return Boolean(this._reduxStore)
  }

  get reduxStore() {
    if (!this.isReduxStoreInitialized()) {
      throw new Error('Redux store is not initialized')
    }

    return (this._reduxStore as ReduxStore)
  }

  set reduxStore(store: ReduxStore) {
    this._reduxStore = store
    this.authentication = new UppyReduxAuthentication(store)
  }

  get isGlobalDropZone() {
    return getSettingsReducerIsNewUploader(this.reduxStore.getState())
  }

  onUploadStart = () => {    
    this.reduxStore.dispatch(uploadReducerSetShowUppyUploaderModal(true))
    this.reduxStore.dispatch(uploadReducerSetUploadingStatus('empty'))
  }

  onUploadSuccess = () => {
    this.reduxStore.dispatch(uploadReducerClearSelectedList())
  }

  isFileAlreadyExist = (currentFile: CurrentUppyFile) => {
    const filesArr = getUploadReducerFilesArr(this.reduxStore.getState())
    return filesArr.some(file => file.originalName === currentFile.name)
  }

  onBeforeFileAdded = (currentFile: CurrentUppyFile) => {
    const isDuplicate = this.isFileAlreadyExist(currentFile)
    if (isDuplicate && currentFile.name) {
      showDuplicatesErrorMessage(currentFile.name)
    }
    return !isDuplicate
  }

  addUploadingFileToStore = (uploadedMedia: Media) => {
    this.reduxStore.dispatch(addUploadingFile(uploadedMedia))
  }

  async onAfterResponse(req: HttpRequest, res: HttpResponse) {
    if (this.authentication) {
      await this.authentication.onAfterResponse(req, res)
    }
    
    const responseProperties = this.parseJSONResponse(res)
    if (responseProperties) {
      this.addUploadingFileToStore(responseProperties)
    }
  }
}

export const uppyWithReduxWrapper = new UppyWithReduxWrapper()

export const initUppyUploader = (currentStore: ReduxStore) => {
  uppyWithReduxWrapper.reduxStore = currentStore
  uppyWithReduxWrapper.init()
}
