import React from 'react'

import { Button, Col, Row } from 'antd'

import { useSelector } from 'react-redux'

import styles from './index.module.scss'
import { upload } from '../../../redux/selectors'
import { useUpdateFields } from '../../common/hooks'
import { PropertyFields } from './components'
import { useCurrentPage, useFilesList, useSelectedList } from '../../common/hooks/hooks'

const PropertyMenu = () => {
  const { isUploadingPage } = useCurrentPage()
  const { isExifLoading } = useSelector(upload)
  const { filesArr } = useFilesList()
  const { selectedList } = useSelectedList()
  const { updateUploadingFiles } = useUpdateFields(filesArr)

  const handleLoadExifDetails = () => {
    selectedList.length && updateUploadingFiles(filesArr[selectedList[0]].tempPath)
  }

  const handleLoadAllExifDetails = () => {
    updateUploadingFiles('_', true)
  }

  return (
    <div className={styles.wrapper}>
      <PropertyFields filesArr={filesArr} selectedList={selectedList} />
      <Row>
        {isUploadingPage && (
          <>
            <Col span={10}>
              <Button
                className="w-100"
                type="primary"
                onClick={handleLoadExifDetails}
                loading={isExifLoading}
                disabled={!selectedList.length || selectedList.length > 1}
              >
                Load exif details
              </Button>
            </Col>
            <Col offset={1} span={13}>
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
