import { createContext } from 'react'

import type { UppyType } from 'src/api/uppy/uppyTypes'

export const UppyInstanceContext = createContext<UppyType | null>(null)
