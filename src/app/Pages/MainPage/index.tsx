import React from 'react'
import { Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { CustomAlert, Gallery, MainMenu } from '../../Components'
import {
  allDownloadingKeywords,
  dAllSameKeywords,
  dPageGalleryPropsSelector,
  folderElement,
  main,
} from '../../../redux/selectors'
import { addToSelectedList, removeFromSelectedList } from '../../../redux/reducers/uploadSlice-reducer'
// import { useUpdateFields } from '../../common/hooks'
import { GalleryProps } from '../../Components/Gallery'
import { removeIntersectingKeywords } from '../../common/utils'
import {
  clearDownloadingState,
  clearDSelectedList,
  selectAllD,
  setDownloadingFiles,
  updateDOpenMenus,
} from '../../../redux/reducers/mainPageSlice-reducer'

const { Content } = Layout

const MainPage = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector(main)
  const uniqKeywords = useSelector(allDownloadingKeywords)
  const sameKeywords = useSelector(dAllSameKeywords)
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const { openMenus, selectedList, imageArr } = mainGalleryProps
  const { currentFolderPath } = useSelector(folderElement)
  // const { updateUploadingFiles } = useUpdateFields()

  const galleryProps: GalleryProps = {
    ...mainGalleryProps,
    removeFromSelectedList: (index: number) => dispatch(removeFromSelectedList(index)),
    addToSelectedList: (index: number) => dispatch(addToSelectedList(index)),
    clearSelectedList: () => dispatch(clearDSelectedList()),
    updateFiles: (tempPath: string) => {
      console.log('updateUploadingFiles', tempPath)
      // updateUploadingFiles(tempPath)
    },
  }

  const mainMenuProps = {
    uploadingFiles: imageArr,
    selectedList: selectedList,
    loading,
    uniqKeywords,
    sameKeywords,
    openKeys: openMenus,
    currentFolderPath,
    clearSelectedList: () => dispatch(clearDSelectedList()),
    selectAll: () => {
      dispatch(selectAllD())
      // updateUploadingFiles('_', true)
    },
    updateOpenMenus: (value: string[]) => dispatch(updateDOpenMenus(value)),
    updateKeywords: (): Promise<any> => {
      console.log('updateUploadingFiles')
      return Promise.resolve(true)
      // updateUploadingFiles('_', true)
    },
    removeKeyword: (keyword: string) => {
      const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], imageArr)
      dispatch(setDownloadingFiles(filesArrWithoutKeyword))
    },
    removeFiles: () => dispatch(clearDownloadingState()),
  }

  return (
    <Layout>
      <MainMenu {...mainMenuProps} />
      <Layout>
        <Content>
          <CustomAlert message="Edit mode" hide={!openMenus.includes('edit')} type="info" />
          <CustomAlert message="Template mode" hide={!openMenus.includes('template')} type="success" />
          <Gallery {...galleryProps} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainPage
