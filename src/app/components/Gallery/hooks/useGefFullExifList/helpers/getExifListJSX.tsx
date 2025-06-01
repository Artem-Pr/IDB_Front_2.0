import React, { ReactNode } from 'react'

import type { Tags } from 'src/api/models/media'

import { prepareExifDataRecursive } from './prepareExifDataRecursive'

export const getExifListJSX = (exif: Tags | undefined, isJSONMode: boolean): string | JSX.Element => {
  const rawExifFieldNames = Object.keys(exif || {})

  const getExifItemValueJSX = (fieldName: keyof Tags): ReactNode => {
    const exifItemValue = exif && exif[fieldName]
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
      JSON.stringify(exif, null, 2)
    )
    : (
      <>
        {rawExifFieldNames.map((fieldName, key) => (
          <div key={`${fieldName}_${key}`}>{getExifItemJSX(fieldName)}</div>
        ))}
      </>
    )
}
