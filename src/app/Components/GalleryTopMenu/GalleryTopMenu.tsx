import React from 'react'
import cn from 'classnames'
import { Checkbox, Col, Popover, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { CheckboxChangeEvent } from 'antd/es/checkbox'

import { formatSize } from '../../common/utils'
import { filesSizeSum, session } from '../../../redux/selectors'

import styles from './GalleryTopMenu.module.scss'
import { useCurrentPage } from '../../common/hooks'
import { setFitContain } from '../../../redux/reducers/sessionSlice-reducer'

export const GalleryTopMenu = () => {
  const dispatch = useDispatch()
  const filesSizeTotal = useSelector(filesSizeSum)
  const { isMainPage } = useCurrentPage()
  const { fitContain } = useSelector(session)

  const handleFitCoverClick = (e: CheckboxChangeEvent) => {
    dispatch(setFitContain(e.target.checked))
  }

  return (
    <Row gutter={10} className={cn(styles.row, 'd-flex align-items-baseline')}>
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
    </Row>
  )
}
