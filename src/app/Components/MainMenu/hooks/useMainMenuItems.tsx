import React, { useMemo } from 'react'
import type { MutableRefObject, ReactNode } from 'react'

import type { CollapseProps } from 'antd'

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

import styles from './useMainMenuItems.module.scss'

import { MainMenuKeys } from '../../../../redux/types'

import { useCurrentPage } from '../../../common/hooks'
import Folders from '../../Folders'
import { ButtonsMenu, KeywordsMenuWrapper, PreviewMenu } from '../components'
import { SortingMenu } from '../../SortingMenu'
import { SearchMenu } from '../../SearchMenu'
import PropertyMenu from '../../PropertyMenu'
import EditMenu from '../../EditMenu'
import type { PreviewMenuProps } from '../components/PreviewMenu/PreviewMenu'
export interface MenuItem {
  key: MainMenuKeys
  label: ReactNode
  icon: JSX.Element
  children: ReactNode
  ref?: MutableRefObject<HTMLDivElement | null>
}

interface MenuItemsProps {
  videoPreviewRef?: PreviewMenuProps['videoPreviewRef']
}

const menuItems = ({ videoPreviewRef }: MenuItemsProps): MenuItem[] => [
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
    children: <PreviewMenu videoPreviewRef={videoPreviewRef} />,
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

export const useMainMenuItems = (videoPreviewRef?: MutableRefObject<HTMLDivElement | null>): MenuItemReturningValue => {
  const { isMainPage, isUploadingPage, isComparisonPage } = useCurrentPage()

  return useMemo(() => {
    const menuItemsFilter = ({ key }: { key: MainMenuKeys }) =>
      (isMainPage && !excludedMainPageMenuItems.includes(key)) ||
      (isUploadingPage && !excludedUploadingPageMenuItems.includes(key)) ||
      (isComparisonPage && !excludedComparisonPageMenuItems.includes(key))

    return {
      extraMenu: [buttonsMenu].filter(menuItemsFilter),
      collapseMenu: menuItems({ videoPreviewRef })
        .filter(menuItemsFilter)
        .map(({ key, label, icon, children }) => {
          const className = key === MainMenuKeys.PREVIEW ? styles.collapsePreviewItem : ''

          return {
            key,
            label: <PanelHeader label={label} icon={icon} />,
            children,
            className,
          }
        }),
    }
  }, [isComparisonPage, isMainPage, isUploadingPage, videoPreviewRef])
}
