import { ReactElement } from 'react'
import { Location } from 'react-router-dom'

export interface LocationState {
    from?: Location
}

export interface RouteType {
    path: string
    element: ReactElement
    permission?: string
}
