import React from 'react'

import { MinusOutlined } from '@ant-design/icons'

import { getLabelValue } from '../../helpers/getLabelValue'
import { usePropertyFields } from '../../hooks'
import { FieldsObj } from '../../types'

import styles from './PropertyFields.module.scss'

interface Props {
  filesArr: FieldsObj[]
  selectedList: number[]
}

export const PropertyFields = ({ filesArr, selectedList }: Props) => {
  const { fieldsObjElements, fieldLabels } = usePropertyFields(filesArr, selectedList)

  return (
    <>
      {Object.typedKeys(fieldLabels).map(fieldName => {
        const labelValue = fieldsObjElements && getLabelValue(fieldName, fieldsObjElements)

        return (
          <div key={fieldName} className={styles.field}>
            <span>{fieldLabels[fieldName]}:</span>
            <span>{labelValue || <MinusOutlined />}</span>
          </div>
        )
      })}
    </>
  )
}
