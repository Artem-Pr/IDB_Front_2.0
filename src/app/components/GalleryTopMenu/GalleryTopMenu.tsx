import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Button, Checkbox, Col, Popover, Row, Slider,
} from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import cn from 'classnames'

import { fetchMainPageDuplicates } from 'src/redux/reducers/mainPageSlice/thunks'
import { refreshPreviewSize, setFitContain, setIsDuplicatesChecking } from 'src/redux/reducers/sessionSlice'
import {
  dSelectedList,
  downloadingFiles,
  filesSizeSum,
  getIsCurrentPage,
  selectedList,
  sessionFitContain,
  sessionIsDuplicatesChecking,
  sessionPreviewSize,
  settings,
} from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { formatSize } from '../../common/utils'

import styles from './GalleryTopMenu.module.scss'

interface Props {
  onSliderMove: (value: number) => void
  finishPreviewResize: (value: number) => void
  setScrollUpWhenUpdating?: React.Dispatch<React.SetStateAction<boolean>>
}

export const GalleryTopMenu = ({ onSliderMove, finishPreviewResize, setScrollUpWhenUpdating }: Props) => {
  const dispatch = useAppDispatch()
  const previewSize = useSelector(sessionPreviewSize)
  const mediaFiles = useSelector(downloadingFiles)
  const uploadSelectedList = useSelector(selectedList)
  const downloadSelectedList = useSelector(dSelectedList)
  const { imagePreviewSlideLimits } = useSelector(settings)
  const filesSizeTotal = useSelector(filesSizeSum)
  const { isMainPage } = useSelector(getIsCurrentPage)
  const fitContain = useSelector(sessionFitContain)
  const isDuplicatesChecking = useSelector(sessionIsDuplicatesChecking)
  const [showSlider, setShowSlider] = useState<boolean>(true)

  const selectedListLength = useMemo(
    () => (isMainPage ? downloadSelectedList.length : uploadSelectedList.length),
    [downloadSelectedList.length, isMainPage, uploadSelectedList.length],
  )

  const handleFitCoverClick = (e: CheckboxChangeEvent) => {
    dispatch(setFitContain(e.target.checked))
  }

  const handleRefreshPreviewSize = () => {
    dispatch(refreshPreviewSize())
    setShowSlider(false)
    setTimeout(() => {
      setShowSlider(true)
    })
  }

  const handleSetScrollUpWhenUpdating = () => {
    setScrollUpWhenUpdating && setScrollUpWhenUpdating(prev => !prev)
  }

  const handleSetIsDuplicatesChecking = () => {
    dispatch(setIsDuplicatesChecking(!isDuplicatesChecking))
    !isDuplicatesChecking && dispatch(fetchMainPageDuplicates(mediaFiles))
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
        <>
          <Col>
            <Checkbox defaultChecked onChange={handleSetScrollUpWhenUpdating}>
            Scroll up when updating
            </Checkbox>
          </Col>
          <Col>
            <Checkbox checked={isDuplicatesChecking} onChange={handleSetIsDuplicatesChecking}>
            Check duplicates
            </Checkbox>
          </Col>
        </>
      )}
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
