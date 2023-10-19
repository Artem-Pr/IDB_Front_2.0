import React, { ReactNode, useMemo } from 'react'

import { CollapseProps } from 'antd'

import {
  CreditCardFilled,
  EditFilled,
  InfoCircleOutlined,
  PictureOutlined,
  ProfileOutlined,
  SearchOutlined,
  SortDescendingOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { MainMenuKeys } from '../../../../redux/types'

import { useCurrentPage } from '../../../common/hooks'
import Folders from '../../Folders'
import { ButtonsMenu, KeywordsMenuWrapper, PreviewMenu } from '../components'
import { SortingMenu } from '../../SortingMenu'
import { SearchMenu } from '../../SearchMenu'
import PropertyMenu from '../../PropertyMenu'
import EditMenu from '../../EditMenu'

export interface MenuItem {
  key: MainMenuKeys
  label: ReactNode
  icon: JSX.Element
  children: ReactNode
}

const menuItems: MenuItem[] = [
  {
    key: MainMenuKeys.SORT,
    label: 'Sort',
    icon: <SortDescendingOutlined />,
    children: <SortingMenu />,
  },
  {
    key: MainMenuKeys.FILTER,
    label: 'Filter',
    icon: <SearchOutlined />,
    children: <SearchMenu />,
  },
  {
    key: MainMenuKeys.FOLDERS,
    label: 'Folders',
    icon: <UserOutlined />,
    children: <Folders />,
  },
  {
    key: MainMenuKeys.PROPERTIES,
    label: 'Properties',
    icon: <InfoCircleOutlined />,
    children: <PropertyMenu />,
  },
  {
    key: MainMenuKeys.EDIT,
    label: 'Edit',
    icon: <EditFilled />,
    children: <EditMenu />,
  },
  {
    key: MainMenuKeys.EDIT_BULK,
    label: 'Edit bulk',
    icon: <CreditCardFilled />,
    children: <EditMenu isEditMany={true} />,
  },
  {
    key: MainMenuKeys.KEYWORDS,
    label: 'Keywords',
    icon: <ProfileOutlined />,
    children: <KeywordsMenuWrapper />,
  },
  {
    key: MainMenuKeys.PREVIEW,
    label: 'Preview',
    icon: <PictureOutlined />,
    children: <PreviewMenu />,
  },
]

const buttonsMenu = {
  key: MainMenuKeys.BUTTONS_MENU,
  children: <ButtonsMenu />,
}

const excludedMainPageMenuItems = [MainMenuKeys.BUTTONS_MENU]
const excludedUploadingPageMenuItems = [MainMenuKeys.FILTER]
const excludedComparisonPageMenuItems = [MainMenuKeys.FILTER, MainMenuKeys.FOLDERS, MainMenuKeys.BUTTONS_MENU]

const PanelHeaderStyles = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
}

const PanelHeader = ({ label, icon }: Pick<MenuItem, 'label' | 'icon'>) => (
  <div style={PanelHeaderStyles}>
    {icon}
    <span>{label}</span>
  </div>
)

interface MenuItemReturningValue {
  collapseMenu: CollapseProps['items']
  extraMenu: Pick<MenuItem, 'key' | 'children'>[]
}

export const useMainMenuItems = (): MenuItemReturningValue => {
  const { isMainPage, isUploadingPage, isComparisonPage } = useCurrentPage()

  return useMemo(() => {
    const menuItemsFilter = ({ key }: { key: MainMenuKeys }) =>
      (isMainPage && !excludedMainPageMenuItems.includes(key)) ||
      (isUploadingPage && !excludedUploadingPageMenuItems.includes(key)) ||
      (isComparisonPage && !excludedComparisonPageMenuItems.includes(key))

    return {
      extraMenu: [buttonsMenu].filter(menuItemsFilter),
      collapseMenu: menuItems.filter(menuItemsFilter).map(({ key, label, icon, children }) => ({
        key,
        label: <PanelHeader label={label} icon={icon} />,
        children,
      })),
    }
  }, [isComparisonPage, isMainPage, isUploadingPage])
}
