import React, { ReactNode } from 'react'

import type { ExifFilesList, RawFullExifObj } from '../../../../../../redux/types'

import { prepareExifDataRecursive } from './prepareExifDataRecursive'

export const getExifListJSX = (fullExifFilesList: ExifFilesList, currentTempPath: string, isJSONMode: boolean) => {
  const rawExif: RawFullExifObj | undefined = fullExifFilesList[currentTempPath] || undefined

  const rawExifFieldNames = Object.keys(rawExif || {})

  const getExifItemValueJSX = (fieldName: string): ReactNode => {
    const exifItemValue = rawExif[fieldName]
    return prepareExifDataRecursive(exifItemValue)
  }

  const getExifItemJSX = (fieldName: string): ReactNode => (
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
