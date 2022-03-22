import React, { useMemo } from 'react'

import { MinusOutlined } from '@ant-design/icons'
import moment from 'moment'

import { Tag } from 'antd'

import { identity, sortBy } from 'ramda'

import styles from './index.module.scss'
import { ExtraDownloadingFields, UploadingObject } from '../../../redux/types'
import { dateFormat, getLastItem } from '../../common/utils'

type FieldsObj = UploadingObject & ExtraDownloadingFields

interface Props {
  filesArr: Array<FieldsObj>
  selectedList: number[]
}

const formatSize = (sizeInt: number) => `${(sizeInt / 1000000).toFixed(3)} Mb`

const PropertyMenu = ({ filesArr, selectedList }: Props) => {
  const fieldsObj = useMemo<FieldsObj | null>(
    () => (!selectedList.length ? null : filesArr[getLastItem(selectedList)]),
    [filesArr, selectedList]
  )

  const keywords = useMemo(
    () => (
      <span>
        {fieldsObj?.keywords ? (
          sortBy(identity, fieldsObj.keywords).map(keyword => <Tag key={keyword}>{keyword}</Tag>)
        ) : (
          <MinusOutlined />
        )}
      </span>
    ),
    [fieldsObj]
  )

  return (
    <div className={styles.wrapper}>
      <div>
        <span>Name:</span>
        <span>{fieldsObj ? fieldsObj.name : <MinusOutlined />}</span>
      </div>
      <div>
        <span>OriginalDate: </span>
        <span>{fieldsObj ? fieldsObj.originalDate : <MinusOutlined />}</span>
      </div>
      <div>
        <span>ChangeDate: </span>
        <span>{fieldsObj ? moment(new Date(fieldsObj.changeDate)).format(dateFormat) : <MinusOutlined />}</span>
      </div>
      <div>
        <span>File path: </span>
        <span>{fieldsObj ? fieldsObj.filePath : <MinusOutlined />}</span>
      </div>
      <div>
        <span>Size: </span>
        <span>{fieldsObj ? formatSize(fieldsObj.size) : <MinusOutlined />}</span>
      </div>
      <div>
        <span>Image size: </span>
        <span>{fieldsObj ? fieldsObj.imageSize : <MinusOutlined />}</span>
      </div>
      <div>
        <span>Megapixels: </span>
        <span>{fieldsObj ? fieldsObj.megapixels : <MinusOutlined />}</span>
      </div>
      <div>
        <span>Type: </span>
        <span>{fieldsObj ? fieldsObj.type : <MinusOutlined />}</span>
      </div>
      <div>
        <span>Keywords: </span>
        {keywords}
      </div>
    </div>
  )
}

export default PropertyMenu
