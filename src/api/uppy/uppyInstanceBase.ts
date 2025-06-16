import type { UploadResult } from '@uppy/core'
import Uppy from '@uppy/core'
import DropTarget from '@uppy/drop-target'
import Tus from '@uppy/tus'
import type { HttpRequest, HttpResponse } from 'tus-js-client/lib'

import { errorMessage, successMessage } from 'src/app/common/notifications'
import { safetyJSONParse } from 'src/app/common/utils/safetyJSONParse'
import type { Defined } from 'src/redux/types'

import { Media } from '../models/media'

import type { UppyAuthentication } from './uppyAuthenticationInterface'
import { tusOptions, uppyOptions } from './uppyConfig'
import type {
  Body,
  CurrentUppyFile,
  Metadata, 
  TusOpt,
  UppyType,
} from './uppyTypes'

export class UppyInstanceBase {
  private _uppyInstance: UppyType | undefined = undefined
  private _isGlobalDropZone: boolean = false
  protected _authentication: UppyAuthentication | undefined = undefined

  get uppyInstance() {
    if (!this._uppyInstance) {
      throw new Error('Uppy instance is not initialized')
    }
    return this._uppyInstance
  }

  set uppyInstance (instance: UppyType) {
    this._uppyInstance = instance
  }

  get authentication(): UppyAuthentication | undefined {
    return this._authentication
  }

  set authentication(auth: UppyAuthentication | undefined) {
    this._authentication = auth
  }

  set isGlobalDropZone(value: boolean) {
    this._isGlobalDropZone = value
  }

  get isGlobalDropZone() {
    return this._isGlobalDropZone
  }

  onComplete = ({ failed, successful }: UploadResult<Metadata, Body>) => {
    if (failed?.length) {
      errorMessage(new Error(`Failed uploads: ${failed.length}`), 'Failed uploads')
    }
    if (successful?.length) {
      successMessage(`Successfully uploaded: ${successful.length}`)
    }
  }

  onUploadStart = () => {}

  onUploadSuccess = () => {}

  onUploadError = (_file: CurrentUppyFile | undefined, error: Error) => {
    errorMessage(error, 'Failed to upload files')
  }

  onBeforeFileAdded = (_currentFile: CurrentUppyFile) => {
    console.info("UppyInstanceBase ~ onBeforeFileAdded:", _currentFile)
    return true
  }

  onBeforeRequest = (req: HttpRequest) => {
    if (this.authentication) {
      this.authentication.onBeforeRequest(req)
    }
  }

  onShouldRetry: Defined<TusOpt['onShouldRetry']> = (err, retryAttempt, options, next) => {
    if (this.authentication) {
      return this.authentication.onShouldRetry(err, retryAttempt, options, next)
    }
    return true
  }

  parseJSONResponse(response: HttpResponse) {
    const responseBody = safetyJSONParse<{ properties: Media }>(response.getBody())
    return responseBody?.properties
  }

  async onAfterResponse(_req: HttpRequest, res: HttpResponse) {
    if (this.authentication) {
      await this.authentication.onAfterResponse(_req, res)
    }
    
    if (!this.parseJSONResponse(res)) {
      console.warn("Warning: No valid properties found in response")
    }
  }

  onFileAdded = (uppyFile: CurrentUppyFile) => {
    this.uppyInstance.setFileMeta(uppyFile.id, {
      changeDate: (uppyFile.data as File).lastModified,
      size: uppyFile.data.size,
    })
  }

  isInitialized() {
    return Boolean(this.uppyInstance)
  }

  init = () => {
    this.uppyInstance = new Uppy({
      ...uppyOptions,
      onBeforeFileAdded: this.onBeforeFileAdded.bind(this),
    })
      .use<typeof Tus<Metadata, Body>>(Tus, {
        ...tusOptions,
        onBeforeRequest: this.onBeforeRequest.bind(this),
        onShouldRetry: this.onShouldRetry.bind(this),
        onAfterResponse: this.onAfterResponse.bind(this),
      })

    if (this.isGlobalDropZone) {
      this.uppyInstance.use(DropTarget, {
        target: document.body,
      })
    }
      
    this.uppyInstance.on('complete', this.onComplete.bind(this))
    this.uppyInstance.on('file-added', this.onFileAdded.bind(this))
    this.uppyInstance.on('upload-error', (this.onUploadError.bind(this)))
    this.uppyInstance.on('upload-start', this.onUploadStart.bind(this))
    this.uppyInstance.on('upload-success', this.onUploadSuccess.bind(this))
  }
}
