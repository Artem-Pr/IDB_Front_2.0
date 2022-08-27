import React, { useEffect, useMemo, useState } from 'react'
import { Col, Layout, Popover, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'ramda'

import { useLocation } from 'react-router-dom'

import { CustomAlert, Gallery, MainMenu } from '../../Components'
import {
  allDownloadingKeywordsSelector,
  curFolderInfo,
  dAllSameKeywordsSelector,
  dPageGalleryPropsSelector,
  filesSizeSum,
  main,
} from '../../../redux/selectors'
import { useUpdateFields, useMenuResize } from '../../common/hooks'
import { GalleryProps } from '../../Components/Gallery'
import { formatSize, removeIntersectingKeywords } from '../../common/utils'
import {
  addToDSelectedList,
  clearDownloadingState,
  clearDSelectedList,
  fetchPhotos,
  removeFromDSelectedList,
  selectAllD,
  setDownloadingFiles,
  updateDOpenMenus,
} from '../../../redux/reducers/mainPageSlice-reducer'
import PaginationMenu from '../../Components/PaginationMenu'
import { ResizeDivider } from '../../Components/ResizeDivider'

const { Content } = Layout

const MainPage = () => {
  const { menuRef, handleDividerMove, handleFinishResize } = useMenuResize()
  const dispatch = useDispatch()
  const location = useLocation()
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)
  const { isExifLoading, isGalleryLoading } = useSelector(main)
  const { currentFolderPath } = useSelector(curFolderInfo)
  const uniqKeywords = useSelector(allDownloadingKeywordsSelector)
  const sameKeywords = useSelector(dAllSameKeywordsSelector)
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const filesSizeTotal = useSelector(filesSizeSum)
  const { openMenus, selectedList, imageArr } = mainGalleryProps
  const { updateUploadingFiles } = useUpdateFields(imageArr)

  const query = new URLSearchParams(location.search)
  const isComparisonPage = Boolean(query.get('comparison'))
  const folderParam = query.get('folder') || undefined

  useEffect(() => {
    isEmpty(imageArr) && !isFilesLoaded && dispatch(fetchPhotos(isComparisonPage, folderParam))
    setIsFilesLoaded(true)
  }, [dispatch, folderParam, imageArr, isComparisonPage, isFilesLoaded])

  const galleryProps: GalleryProps = useMemo(
    () => ({
      ...mainGalleryProps,
      removeFromSelectedList: (index: number) => dispatch(removeFromDSelectedList(index)),
      addToSelectedList: (index: number) => dispatch(addToDSelectedList(index)),
      clearSelectedList: () => dispatch(clearDSelectedList()),
      updateFiles: (tempPath: string) => updateUploadingFiles(tempPath),
      isLoading: isGalleryLoading,
      isMainPage: true,
    }),
    [dispatch, isGalleryLoading, mainGalleryProps, updateUploadingFiles]
  )

  const mainMenuProps = useMemo(
    () => ({
      filesArr: imageArr,
      selectedList: selectedList,
      isExifLoading,
      uniqKeywords,
      sameKeywords,
      openKeys: openMenus,
      currentFolderPath,
      isComparisonPage,
      clearSelectedList: () => dispatch(clearDSelectedList()),
      selectAll: () => dispatch(selectAllD()),
      updateOpenMenus: (value: string[]) => dispatch(updateDOpenMenus(value)),
      removeKeyword: (keyword: string) => {
        const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], imageArr)
        dispatch(setDownloadingFiles(filesArrWithoutKeyword))
      },
      removeFiles: () => dispatch(clearDownloadingState()),
    }),
    [
      currentFolderPath,
      dispatch,
      imageArr,
      isComparisonPage,
      isExifLoading,
      openMenus,
      sameKeywords,
      selectedList,
      uniqKeywords,
    ]
  )

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
          <Row className="d-flex align-items-baseline">
            <Col>{!isComparisonPage && <PaginationMenu />}</Col>
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
