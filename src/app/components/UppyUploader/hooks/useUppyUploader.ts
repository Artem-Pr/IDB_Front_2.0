import { uppyWithReduxWrapper } from 'src/api/uppy/uppyWithReduxWrapper'

import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/drop-target/dist/style.css'
import '@uppy/file-input/dist/style.css'

export const useUppyUploader = () => uppyWithReduxWrapper
