import React, { useState } from 'react'
import cn from 'classnames'
import { Button, Checkbox, Col, Popover, Row, Slider } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { CheckboxChangeEvent } from 'antd/es/checkbox'

import { formatSize } from '../../common/utils'
import { filesSizeSum, session } from '../../../redux/selectors'

import styles from './GalleryTopMenu.module.scss'
import { useCurrentPage } from '../../common/hooks'
import { refreshPreviewSize, setFitContain } from '../../../redux/reducers/sessionSlice-reducer'

interface Props {
  onSliderMove: (value: number) => void
  finishPreviewResize: (value: number) => void
}

export const GalleryTopMenu = ({ onSliderMove, finishPreviewResize }: Props) => {
  const dispatch = useDispatch()
  const { previewSize } = useSelector(session)
  const [showSlider, setShowSlider] = useState<boolean>(true)
  const filesSizeTotal = useSelector(filesSizeSum)
  const { isMainPage } = useCurrentPage()
  const { fitContain } = useSelector(session)

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
      <Col>
        {showSlider && (
          <Slider
            className={styles.slider}
            defaultValue={previewSize}
            min={20}
            max={600}
            onChange={onSliderMove}
            onAfterChange={finishPreviewResize}
          />
        )}
      </Col>
      <Col>
        <Button size="small" shape="round" type="primary" onClick={handleRefreshPreviewSize}>
          Refresh
        </Button>
      </Col>
    </Row>
  )
}
