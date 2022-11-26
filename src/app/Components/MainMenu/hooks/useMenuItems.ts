import React, { useMemo } from 'react'

import { FieldsObj, MainMenuKeys } from '../../../../redux/types'

import {
  buttonsMenu,
  editBulkMenu,
  editMenu,
  filtersMenu,
  foldersMenu,
  keywordsMenu,
  previewMenu,
  propertiesMenu,
} from '../utils'
import { useCurrentPage } from '../../../common/hooks'

const excludedMainPageMenuItems = [MainMenuKeys.BUTTONS_MENU]
const excludedUploadingPageMenuItems = [MainMenuKeys.FILTER]
const excludedComparisonPageMenuItems = [MainMenuKeys.FILTER, MainMenuKeys.FOLDERS, MainMenuKeys.BUTTONS_MENU]

export interface MenuItem {
  key: MainMenuKeys
  label: string
  icon: React.ReactNode
  Children: React.FC
}

interface MenuItemProps {
  filesArr: FieldsObj[]
  selectedList: number[]
  isExifLoading: boolean
  uniqKeywords: string[]
  sameKeywords: string[]
  allKeywords: string[]
  currentFolderPath: string
  updateOpenMenus: (value: MainMenuKeys[]) => void
  clearSelectedList: () => void
  selectAll: () => void
  removeKeyword: (keyword: string) => void
  removeFiles: () => void
  isComparisonPage?: boolean
}

interface MenuItemReturningValue {
  collapseMenu: MenuItem[]
  extraMenu: Pick<MenuItem, 'key' | 'Children'>[]
}

export const useMainMenuItems = (menuItemProps: MenuItemProps): MenuItemReturningValue => {
  const { isMainPage, isUploadingPage } = useCurrentPage()
  const {
    filesArr,
    selectedList,
    sameKeywords,
    isExifLoading,
    isComparisonPage,
    allKeywords,
    uniqKeywords,
    currentFolderPath,
    removeFiles,
    updateOpenMenus,
    removeKeyword,
    selectAll,
    clearSelectedList: clearAll,
  } = menuItemProps

  const memoizedPropertiesMenu = useMemo(
    () => propertiesMenu({ filesArr, selectedList, isUploadingPage }),
    [filesArr, isUploadingPage, selectedList]
  )

  const memoizedEditMenu = useMemo(
    () => editMenu({ filesArr, selectedList, sameKeywords, allKeywords, isExifLoading }),
    [allKeywords, filesArr, isExifLoading, sameKeywords, selectedList]
  )

  const memoizedEditBulkMenu = useMemo(
    () =>
      editBulkMenu({
        filesArr,
        selectedList,
        sameKeywords,
        allKeywords,
        selectAll,
        clearAll,
        isExifLoading,
      }),
    [allKeywords, clearAll, filesArr, isExifLoading, sameKeywords, selectAll, selectedList]
  )

  const memoizedKeywordsMenu = useMemo(
    () => keywordsMenu({ uniqKeywords, removeKeyword }),
    [removeKeyword, uniqKeywords]
  )

  const memoizedButtonsMenu = useMemo(
    () => buttonsMenu({ filesArr, currentFolderPath, removeFiles, updateOpenMenus }),
    [currentFolderPath, filesArr, removeFiles, updateOpenMenus]
  )

  return useMemo(() => {
    const menuItemsFilter = ({ key }: { key: MainMenuKeys }) =>
      (isMainPage && !excludedMainPageMenuItems.includes(key)) ||
      (isUploadingPage && !excludedUploadingPageMenuItems.includes(key)) ||
      (isComparisonPage && !excludedComparisonPageMenuItems.includes(key))

    const defaultMenu = [
      filtersMenu,
      foldersMenu,
      memoizedPropertiesMenu,
      memoizedEditMenu,
      memoizedEditBulkMenu,
      memoizedKeywordsMenu,
      previewMenu,
    ]

    return {
      extraMenu: [memoizedButtonsMenu].filter(menuItemsFilter),
      collapseMenu: defaultMenu.filter(menuItemsFilter),
    }
  }, [
    isComparisonPage,
    isMainPage,
    isUploadingPage,
    memoizedButtonsMenu,
    memoizedEditBulkMenu,
    memoizedEditMenu,
    memoizedKeywordsMenu,
    memoizedPropertiesMenu,
  ])
}
