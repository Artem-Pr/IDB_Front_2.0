import React from 'react'

import { MinusOutlined } from '@ant-design/icons'

import type { Media } from 'src/api/models/media'

import { getLabelValue } from '../../helpers/getLabelValue'
import { usePropertyFields } from '../../hooks'

import styles from './PropertyFields.module.scss'

interface Props {
  filesArr: Media[]
  selectedList: number[]
}

export const PropertyFields = ({ filesArr, selectedList }: Props) => {
  const { fieldsObjElements, fieldLabels } = usePropertyFields(filesArr, selectedList)

  return (
    <>
      {Object.keys(fieldLabels)
        .map(fieldName => {
          const labelValue = fieldsObjElements && getLabelValue(fieldName, fieldsObjElements)

          return (
            <div key={fieldName} className={styles.field}>
              <span>
                {fieldLabels[fieldName]}
:
              </span>
              <span>{labelValue || <MinusOutlined />}</span>
            </div>
          )
        })}
    </>
  )
}
