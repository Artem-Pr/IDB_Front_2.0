import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Button, Checkbox, Col, Popover, Row, Slider,
} from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import cn from 'classnames'

import { getMainPageReducerFilesArr, getMainPageReducerSelectedList, getMainPageReducerFilesSizeSum } from 'src/redux/reducers/mainPageSlice/selectors'
import { fetchMainPageDuplicates } from 'src/redux/reducers/mainPageSlice/thunks'
import {
  sessionReducerRefreshPreviewSize,
  sessionReducerSetFitContain,
  sessionReducerSetIsDuplicatesChecking,
  sessionReducerSetScrollUpWhenUpdating,
} from 'src/redux/reducers/sessionSlice'
import {
  getSessionReducerIsCurrentPage,
  getSessionReducerFitContain,
  getSessionReducerIsDuplicatesChecking,
  getSessionReducerPreviewSize,
  getSessionReducerScrollUpWhenUpdating,
} from 'src/redux/reducers/sessionSlice/selectors'
import { getSettingsReducerImagePreviewSlideLimits } from 'src/redux/reducers/settingsSlice/selectors'
import { getUploadReducerSelectedList } from 'src/redux/reducers/uploadSlice/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { formatSize } from '../../common/utils'

import styles from './GalleryTopMenu.module.scss'

interface Props {
  finishPreviewResize: (value: number) => void
  onSliderMove: (value: number) => void
}

export const GalleryTopMenu = ({
  onSliderMove,
  finishPreviewResize,
}: Props) => {
  const dispatch = useAppDispatch()
  const previewSize = useSelector(getSessionReducerPreviewSize)
  const mediaFiles = useSelector(getMainPageReducerFilesArr)
  const uploadSelectedList = useSelector(getUploadReducerSelectedList)
  const downloadSelectedList = useSelector(getMainPageReducerSelectedList)
  const imagePreviewSlideLimits = useSelector(getSettingsReducerImagePreviewSlideLimits)
  const filesSizeTotal = useSelector(getMainPageReducerFilesSizeSum)
  const { isMainPage } = useSelector(getSessionReducerIsCurrentPage)
  const fitContain = useSelector(getSessionReducerFitContain)
  const isDuplicatesChecking = useSelector(getSessionReducerIsDuplicatesChecking)
  const scrollUpWhenUpdating = useSelector(getSessionReducerScrollUpWhenUpdating)
  const [showSlider, setShowSlider] = useState<boolean>(true)

  const selectedListLength = useMemo(
    () => (isMainPage ? downloadSelectedList.length : uploadSelectedList.length),
    [downloadSelectedList.length, isMainPage, uploadSelectedList.length],
  )

  const handleFitCoverClick = (e: CheckboxChangeEvent) => {
    dispatch(sessionReducerSetFitContain(e.target.checked))
  }

  const handleRefreshPreviewSize = () => {
    dispatch(sessionReducerRefreshPreviewSize())
    setShowSlider(false)
    setTimeout(() => {
      setShowSlider(true)
    })
  }

  const handleSetScrollUpWhenUpdating = () => {
    dispatch(sessionReducerSetScrollUpWhenUpdating(!scrollUpWhenUpdating))
  }

  const handleSetIsDuplicatesChecking = () => {
    dispatch(sessionReducerSetIsDuplicatesChecking(!isDuplicatesChecking))
    isMainPage && !isDuplicatesChecking && dispatch(fetchMainPageDuplicates(mediaFiles))
  }

  return (
    <Row gutter={10} className={cn(styles.row, 'd-flex align-items-center')}>
      {Boolean(isMainPage && filesSizeTotal) && (
        <Col>
          <Popover content="Size of all requested files">{formatSize(filesSizeTotal)}</Popover>
        </Col>
      )}
      <Col>
        <Checkbox checked={fitContain} onChange={handleFitCoverClick}>
          Fit - contain
        </Checkbox>
      </Col>
      {isMainPage && (
        <Col>
          <Checkbox checked={scrollUpWhenUpdating} onChange={handleSetScrollUpWhenUpdating}>
            Scroll up when updating
          </Checkbox>
        </Col>
      )}
      <Col>
        <Checkbox checked={isDuplicatesChecking} onChange={handleSetIsDuplicatesChecking}>
            Check duplicates
        </Checkbox>
      </Col>
      <Col>
        {showSlider && (
          <Slider
            className={styles.slider}
            defaultValue={previewSize}
            min={imagePreviewSlideLimits.min}
            max={imagePreviewSlideLimits.max}
            onChange={onSliderMove}
            onChangeComplete={finishPreviewResize}
          />
        )}
      </Col>
      <Col>
        <Button size="small" shape="round" type="primary" onClick={handleRefreshPreviewSize}>
          Refresh
        </Button>
      </Col>
      <Col>
        <span>selected:</span>
        <span className="margin-left-10">{selectedListLength}</span>
      </Col>
    </Row>
  )
}
