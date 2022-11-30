import React, { MutableRefObject, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse, Layout } from 'antd'

import { difference } from 'ramda'

import styles from './index.module.scss'
import { FieldsObj, MainMenuKeys } from '../../../redux/types'
import { folderElement, imagePreview, session } from '../../../redux/selectors'
import { fetchKeywordsList } from '../../../redux/reducers/foldersSlice-reducer'
import { useMainMenuItems } from './hooks'

const { Sider } = Layout
const { Panel } = Collapse

interface PanelHeaderProps {
  title: string
  icon: React.ReactNode
}

const PanelHeader = ({ title, icon }: PanelHeaderProps) => (
  <div className={styles.panelHeader}>
    {icon}
    <span>{title}</span>
  </div>
)

interface Props {
  filesArr: FieldsObj[]
  selectedList: number[]
  openKeys: MainMenuKeys[]
  isExifLoading: boolean
  uniqKeywords: string[]
  sameKeywords: string[]
  currentFolderPath: string
  updateOpenMenus: (value: MainMenuKeys[]) => void
  clearSelectedList: () => void
  selectAll: () => void
  removeKeyword: (keyword: string) => void
  removeFiles: () => void
  isComparisonPage?: boolean
  menuRef: MutableRefObject<HTMLDivElement | null>
}

const MainMenu = ({
  filesArr,
  selectedList,
  openKeys,
  updateOpenMenus,
  removeKeyword,
  currentFolderPath,
  isComparisonPage,
  clearSelectedList,
  selectAll,
  isExifLoading,
  uniqKeywords,
  sameKeywords,
  removeFiles,
  menuRef,
}: Props) => {
  const dispatch = useDispatch()
  const { asideMenuWidth: defaultMenuWidth } = useSelector(session)
  const { keywordsList: allKeywords } = useSelector(folderElement)
  const { originalPath } = useSelector(imagePreview)
  const { collapseMenu, extraMenu } = useMainMenuItems({
    filesArr,
    selectedList,
    clearSelectedList,
    selectAll,
    isExifLoading,
    allKeywords,
    removeFiles,
    sameKeywords,
    uniqKeywords,
    removeKeyword,
    isComparisonPage,
    updateOpenMenus,
    currentFolderPath,
  })

  useEffect(() => {
    !allKeywords.length && dispatch(fetchKeywordsList())
  }, [allKeywords.length, dispatch])

  const handleTitleClick = (keys: string | string[]) => {
    const keysArr = Array.isArray(keys) ? (keys as MainMenuKeys[]) : ([keys] as MainMenuKeys[])

    const clearSelectedListWhenCloseEditors = () => {
      const closingKey = difference(openKeys, keysArr)[0]
      const isClosingPropertyAfterEdit =
        closingKey === MainMenuKeys.PROPERTIES &&
        !keysArr.includes(MainMenuKeys.EDIT) &&
        !keysArr.includes(MainMenuKeys.EDIT_BULK)
      const needClearing =
        isClosingPropertyAfterEdit || closingKey === MainMenuKeys.EDIT || closingKey === MainMenuKeys.EDIT_BULK
      needClearing && clearSelectedList()
    }

    const openingKey = difference(keysArr, openKeys)[0]
    const openKeysSet = new Set(keysArr)
    openingKey === MainMenuKeys.EDIT && openKeysSet.delete(MainMenuKeys.EDIT_BULK) && clearSelectedList()
    openingKey === MainMenuKeys.EDIT_BULK && openKeysSet.delete(MainMenuKeys.EDIT) && clearSelectedList()
    clearSelectedListWhenCloseEditors()
    updateOpenMenus(Array.from(openKeysSet))
  }

  return (
    <Sider theme="light" className={styles.sider} ref={menuRef} width={defaultMenuWidth}>
      <Collapse defaultActiveKey={openKeys} activeKey={openKeys} onChange={handleTitleClick} expandIconPosition="end">
        {collapseMenu.map(({ key, label, icon, Children }) => {
          const hidePreview = key === MainMenuKeys.PREVIEW && !originalPath
          const hideChildren = key === MainMenuKeys.PREVIEW && !openKeys.includes(key)

          return (
            <Panel
              key={key}
              className={`collapse-panel-${key}`}
              header={<PanelHeader title={label} icon={icon} />}
              collapsible={hidePreview ? 'disabled' : undefined}
            >
              {!hideChildren && <Children />}
            </Panel>
          )
        })}
      </Collapse>
      {extraMenu.map(({ key, Children }) => (
        <div key={key} className={styles.extraMenu}>
          <Children />
        </div>
      ))}
    </Sider>
  )
}

export default MainMenu
