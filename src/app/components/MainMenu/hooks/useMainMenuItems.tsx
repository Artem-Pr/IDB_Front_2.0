import React, { useMemo } from 'react'
import type { MutableRefObject, ReactNode } from 'react'
import { useSelector } from 'react-redux'

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
import type { CollapseProps } from 'antd'
import cn from 'classnames'

import { MainMenuKeys } from 'src/common/constants'
import { getIsCurrentPage, previewDuplicates } from 'src/redux/selectors'

import { EditMenu } from '../../EditMenu'
import { Folders } from '../../Folders/Folders'
import { PropertyMenu } from '../../PropertyMenu'
import { SearchMenu } from '../../SearchMenu'
import { SortingMenu } from '../../SortingMenu'
import {
  ButtonsMenu, KeywordsMenuWrapper, PreviewMenu, DuplicatesMenu,
} from '../components'
import type { PreviewMenuProps } from '../components/PreviewMenu/PreviewMenu'

import styles from './useMainMenuItems.module.scss'

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
    children: <EditMenu isEditMany />,
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
  {
    key: MainMenuKeys.DUPLICATES,
    label: 'Duplicates',
    icon: <PictureOutlined />,
    children: <DuplicatesMenu videoPreviewRef={videoPreviewRef} />,
  },
]

const buttonsMenu = {
  key: MainMenuKeys.BUTTONS_MENU,
  children: <ButtonsMenu />,
}

const excludedMainPageMenuItems = [MainMenuKeys.BUTTONS_MENU, MainMenuKeys.DUPLICATES]
const excludedUploadingPageMenuItems = [MainMenuKeys.FILTER, MainMenuKeys.DUPLICATES]

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
  const { isMainPage, isUploadPage } = useSelector(getIsCurrentPage)
  const previewDuplicatesArr = useSelector(previewDuplicates)

  return useMemo(() => {
    const menuItemsFilter = ({ key }: { key: MainMenuKeys }) => (
      (isMainPage && !excludedMainPageMenuItems.includes(key))
        || (isUploadPage && !excludedUploadingPageMenuItems.includes(key))
        || (previewDuplicatesArr.length > 0 && key === MainMenuKeys.DUPLICATES)
    )

    return {
      extraMenu: [buttonsMenu].filter(menuItemsFilter),
      collapseMenu: menuItems({ videoPreviewRef })
        .filter(menuItemsFilter)
        .map(({
          key, label, icon, children,
        }) => {
          const className = cn({
            [styles.collapsePreviewItem]: key === MainMenuKeys.PREVIEW,
            [styles.collapseDuplicateItem]: key === MainMenuKeys.DUPLICATES,
          })

          return {
            key,
            label: <PanelHeader label={label} icon={icon} />,
            children,
            className,
          }
        }),
    }
  }, [isMainPage, isUploadPage, previewDuplicatesArr.length, videoPreviewRef])
}
