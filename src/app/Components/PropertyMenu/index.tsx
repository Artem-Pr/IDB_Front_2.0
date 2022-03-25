import React, { useMemo } from 'react'

import { MinusOutlined } from '@ant-design/icons'
import moment from 'moment'

import { Button, Col, Row, Tag } from 'antd'

import { identity, sortBy } from 'ramda'

import { useSelector } from 'react-redux'

import styles from './index.module.scss'
import { ExtraDownloadingFields, UploadingObject } from '../../../redux/types'
import { dateFormat, getLastItem } from '../../common/utils'
import { dPageGalleryPropsSelector, upload, uploadPageGalleryPropsSelector } from '../../../redux/selectors'
import { useUpdateFields } from '../../common/hooks/hooks'

type FieldsObj = UploadingObject & ExtraDownloadingFields

interface Props {
  filesArr: Array<FieldsObj>
  selectedList: number[]
  isUploadingPage: boolean
}

const formatSize = (sizeInt: number) => `${(sizeInt / 1000000).toFixed(3)} Mb`

const PropertyMenu = ({ filesArr, selectedList, isUploadingPage }: Props) => {
  const { isExifLoading } = useSelector(upload)
  const { imageArr } = useSelector(isUploadingPage ? uploadPageGalleryPropsSelector : dPageGalleryPropsSelector)
  const { updateUploadingFiles } = useUpdateFields(imageArr)

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

  const handleLoadExifDetails = () => {
    selectedList.length && updateUploadingFiles(filesArr[selectedList[0]].tempPath)
  }

  const handleLoadAllExifDetails = () => {
    updateUploadingFiles('_', true)
  }

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
      <Row>
        {isUploadingPage && (
          <>
            <Col span={10}>
              <Button
                className="w-100"
                type="primary"
                onClick={handleLoadExifDetails}
                loading={isExifLoading}
                disabled={!selectedList.length}
              >
                Load exif details
              </Button>
            </Col>
            <Col span={14}>
              <Button
                className="w-100"
                type="primary"
                onClick={handleLoadAllExifDetails}
                loading={isExifLoading}
                disabled={!filesArr.length}
              >
                Load all exif details
              </Button>
            </Col>
          </>
        )}
      </Row>
    </div>
  )
}

export default PropertyMenu
