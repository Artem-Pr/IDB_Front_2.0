import Uppy from '@uppy/core'
import DropTarget from '@uppy/drop-target'
import FileInput from '@uppy/file-input'
import Tus from '@uppy/tus'

import { errorMessage } from 'src/app/common/notifications'
import { safetyJSONParse } from 'src/app/common/utils/safetyJSONParse'

import { Media } from '../models/media'

import { tusOptions, uppyOptions } from './uppyConfig'
import type {
  Metadata, Body, UppyInstanceConstructor, UppyType,
} from './uppyTypes'

const showDuplicatesErrorMessage = (duplicateFileName: string) => {
  errorMessage(new Error(`${duplicateFileName} is already exist`), 'File is not uploaded')
}

export class UppyInstance {
  private uppyInstance: UppyType

  constructor({
    isFileAlreadyExist, processResponse, onComplete, onUploadStart, onUploadSuccess, isGlobalDropZone, onUploadError,
  }: UppyInstanceConstructor) {
    this.uppyInstance = new Uppy({
      ...uppyOptions,
      onBeforeFileAdded: currentFile => {
        const isDuplicate = isFileAlreadyExist(currentFile)

        if (isDuplicate && currentFile.name) {
          showDuplicatesErrorMessage(currentFile.name)
        }

        return !isDuplicate
      },
    })
      .use<typeof Tus<Metadata, Body>>(Tus, {
        ...tusOptions,
        onAfterResponse(_req, res) {
          const responseBody = safetyJSONParse<{ properties: Media }>(res.getBody())
          if (responseBody?.properties) {
            processResponse(responseBody.properties)
          }
        },
      })

    if (isGlobalDropZone) {
      this.uppyInstance.use(DropTarget, {
        target: document.body,
      })
    }

    this.uppyInstance.on('file-added', uppyFile => {
      this.uppyInstance.setFileMeta(uppyFile.id, {
        changeDate: (uppyFile.data as File).lastModified,
        size: uppyFile.data.size,
      })
    })
    this.uppyInstance.on('upload-start', file => {
      onUploadStart && onUploadStart(file)
    })
    this.uppyInstance.on('complete', result => {
      onComplete && onComplete(result)
    })
    this.uppyInstance.on('upload-success', (file, response) => {
      onUploadSuccess && onUploadSuccess(file, response)
    })
    this.uppyInstance.on('upload-error', (file, error) => {
      onUploadError && onUploadError(file, error)
    })
  }

  applyFileInput(target: string) {
    this.uppyInstance.use(FileInput, { target, replaceTargetContent: true })
  }

  get uppy() {
    return this.uppyInstance
  }
}
