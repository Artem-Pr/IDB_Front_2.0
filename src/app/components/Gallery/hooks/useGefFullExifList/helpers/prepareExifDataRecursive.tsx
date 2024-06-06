import React from 'react'

import { isObject } from './isObject'

export const prepareExifDataRecursive = (value: any) => {
  if (isObject(value)) {
    return (
      <ul>
        {Object.keys(value)
          .map((fieldName, key) => (
            <li key={`${fieldName}_${key}`}>
              <span className="bold">{fieldName}</span>
              <span style={{ marginLeft: 5 }}>{prepareExifDataRecursive(value[fieldName])}</span>
            </li>
          ))}
      </ul>
    )
  }

  if (Array.isArray(value)) {
    return (
      <ul>
        {value.map((item, key) => (
          <li key={`${item}_${key}`}>{prepareExifDataRecursive(item)}</li>
        ))}
      </ul>
    )
  }

  return value
}
