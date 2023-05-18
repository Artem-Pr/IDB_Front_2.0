import React from 'react'

import type { RawDataValue } from '../../../../../../redux/types'
import { isObject } from './isObject'

export const prepareExifDataRecursive = (value: RawDataValue) =>
  isObject(value) ? (
    <ul>
      {Object.keys(value).map((fieldName, key) => (
        <li key={`${fieldName}_${key}`}>
          <span className="bold">{fieldName}</span>
          <span style={{ marginLeft: 5 }}>{prepareExifDataRecursive(value[fieldName])}</span>
        </li>
      ))}
    </ul>
  ) : Array.isArray(value) ? (
    <ul>
      {value.map((item, key) => (
        <li key={`${item}_${key}`}>{prepareExifDataRecursive(item)}</li>
      ))}
    </ul>
  ) : (
    value
  )
