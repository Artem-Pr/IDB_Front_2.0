import React, { ReactNode } from 'react'

import type { Tags } from 'exiftool-vendored'

import type { Media } from 'src/api/models/media'
import type { ExifFilesList } from 'src/redux/types'

import { prepareExifDataRecursive } from './prepareExifDataRecursive'

export const getExifListJSX = (fullExifFilesList: ExifFilesList, currentId: Media['id'], isJSONMode: boolean) => {
  const rawExif: Tags | undefined = fullExifFilesList[currentId] || undefined

  const rawExifFieldNames = Object.keys(rawExif || {})

  const getExifItemValueJSX = (fieldName: keyof Tags): ReactNode => {
    const exifItemValue = rawExif && rawExif[fieldName]
    return prepareExifDataRecursive(exifItemValue)
  }

  const getExifItemJSX = (fieldName: keyof Tags): ReactNode => (
    <>
      <span className="bold">{`${fieldName}:`}</span>
      <span style={{ marginLeft: 5 }}>{getExifItemValueJSX(fieldName)}</span>
    </>
  )

  return isJSONMode
    ? (
      JSON.stringify(rawExif, null, 2)
    )
    : (
      <>
        {rawExifFieldNames.map((fieldName, key) => (
          <div key={`${fieldName}_${key}`}>{getExifItemJSX(fieldName)}</div>
        ))}
      </>
    )
}
