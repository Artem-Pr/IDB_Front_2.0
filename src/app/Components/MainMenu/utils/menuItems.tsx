import React from 'react'

import {
  SortDescendingOutlined,
  CreditCardFilled,
  EditFilled,
  InfoCircleOutlined,
  PictureOutlined,
  ProfileOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { EditMenu, Folders, SearchMenu, SortingMenu } from '../../index'

import { FieldsObj, MainMenuKeys } from '../../../../redux/types'
import PropertyMenu from '../../PropertyMenu'
import { ButtonsMenu, KeywordsMenuWrapper, PreviewMenu } from '../components'

export const sortMenu = {
  key: MainMenuKeys.SORT,
  label: 'Sort',
  icon: <SortDescendingOutlined />,
  Children: () => <SortingMenu />,
}

export const filtersMenu = {
  key: MainMenuKeys.FILTER,
  label: 'Filter',
  icon: <SearchOutlined />,
  Children: () => <SearchMenu />,
}

export const foldersMenu = {
  key: MainMenuKeys.FOLDERS,
  label: 'Folders',
  icon: <UserOutlined />,
  Children: () => <Folders />,
}

export const propertiesMenu = (props: { filesArr: FieldsObj[]; selectedList: number[]; isUploadingPage: boolean }) => ({
  key: MainMenuKeys.PROPERTIES,
  label: 'Properties',
  icon: <InfoCircleOutlined />,
  Children: () => <PropertyMenu {...props} />,
})

export const editMenu = (props: {
  filesArr: FieldsObj[]
  selectedList: number[]
  sameKeywords: string[]
  allKeywords: string[]
  isExifLoading: boolean
}) => ({
  key: MainMenuKeys.EDIT,
  label: 'Edit',
  icon: <EditFilled />,
  Children: () => <EditMenu {...props} />,
})

export const editBulkMenu = (props: {
  filesArr: FieldsObj[]
  selectedList: number[]
  sameKeywords: string[]
  allKeywords: string[]
  selectAll: () => void
  clearAll: () => void
  isExifLoading: boolean
}) => ({
  key: MainMenuKeys.EDIT_BULK,
  label: 'Edit bulk',
  icon: <CreditCardFilled />,
  Children: () => <EditMenu {...props} isEditMany={true} />,
})

export const keywordsMenu = (props: { uniqKeywords: string[]; removeKeyword: (keyword: string) => void }) => ({
  key: MainMenuKeys.KEYWORDS,
  label: 'Keywords',
  icon: <ProfileOutlined />,
  Children: () => <KeywordsMenuWrapper {...props} />,
})

export const previewMenu = {
  key: MainMenuKeys.PREVIEW,
  label: 'Preview',
  icon: <PictureOutlined />,
  Children: () => <PreviewMenu />,
}

export const buttonsMenu = (props: {
  filesArr: FieldsObj[]
  currentFolderPath: string
  updateOpenMenus: (value: MainMenuKeys[]) => void
  removeFiles: () => void
}) => ({
  key: MainMenuKeys.BUTTONS_MENU,
  Children: () => <ButtonsMenu {...props} />,
})
