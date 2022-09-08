import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Col, Layout, Popover, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'ramda'

import { useLocation } from 'react-router-dom'

import { CustomAlert, Gallery, MainMenu } from '../../Components'
import { dPageGalleryPropsSelector, filesSizeSum } from '../../../redux/selectors'
import { useMenuResize } from '../../common/hooks'
import { formatSize } from '../../common/utils'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice-reducer'
import PaginationMenu from '../../Components/PaginationMenu'
import { ResizeDivider } from '../../Components/ResizeDivider'

import styles from './index.module.scss'
import { useGalleryProps, useMainMenuProps } from './hooks'

const { Content } = Layout

const MainPage = () => {
  const { menuRef, handleDividerMove, handleFinishResize } = useMenuResize()
  const dispatch = useDispatch()
  const mainMenuProps = useMainMenuProps()
  const galleryProps = useGalleryProps()
  const location = useLocation()
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const filesSizeTotal = useSelector(filesSizeSum)
  const { openMenus, imageArr } = mainGalleryProps

  const query = new URLSearchParams(location.search)
  const isComparisonPage = Boolean(query.get('comparison'))
  const folderParam = query.get('folder') || undefined

  useEffect(() => {
    isEmpty(imageArr) && !isFilesLoaded && dispatch(fetchPhotos(isComparisonPage, folderParam))
    setIsFilesLoaded(true)
  }, [dispatch, folderParam, imageArr, isComparisonPage, isFilesLoaded])

  return (
    <Layout>
      <MainMenu {...mainMenuProps} menuRef={menuRef} />
      <div style={{ height: 'calc(100vh - 64px)' }}>
        <ResizeDivider onDividerMove={handleDividerMove} onMouseUp={handleFinishResize} />
      </div>
      <Layout>
        <Content>
          <CustomAlert message="Edit mode" hide={!openMenus.includes('edit')} type="info" />
          <CustomAlert message="Template mode" hide={!openMenus.includes('template')} type="success" />
          <Row className={cn(styles.row, 'd-flex align-items-baseline')}>
            {Boolean(filesSizeTotal) && (
              <Col offset={1}>
                <Popover content="Size of all requested files">{formatSize(filesSizeTotal)}</Popover>
              </Col>
            )}
          </Row>
          <Gallery {...galleryProps} />
          {!isComparisonPage && <PaginationMenu />}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainPage
