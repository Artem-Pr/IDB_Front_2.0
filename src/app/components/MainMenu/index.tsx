import React, { MutableRefObject, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Collapse, Layout } from 'antd'
import { difference } from 'ramda'

import { MainMenuKeys } from 'src/common/constants'
import { fetchKeywordsList } from 'src/redux/reducers/foldersSlice/thunks'
import { stopVideoPreview } from 'src/redux/reducers/mainPageSlice/mainPageSlice'
import { folderElement, openMenusSelector, session } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { useClearSelectedList, useUpdateOpenMenus } from '../../common/hooks'

import { useMainMenuItems } from './hooks'

import styles from './index.module.scss'

const { Sider } = Layout

const isMainMenuKeysArray = (keys: string | string[]): keys is MainMenuKeys[] => Array.isArray(keys)
interface Props {
  menuRef: MutableRefObject<HTMLDivElement | null>
  videoPreviewRef?: MutableRefObject<HTMLDivElement | null>
}

const MainMenu = ({ menuRef, videoPreviewRef }: Props) => {
  const dispatch = useAppDispatch()
  const { asideMenuWidth: defaultMenuWidth } = useSelector(session)
  const { keywordsList: allKeywords } = useSelector(folderElement)
  const { collapseMenu, extraMenu } = useMainMenuItems(videoPreviewRef)
  const { setOpenMenus } = useUpdateOpenMenus()
  const { clearSelectedList } = useClearSelectedList()
  const openMenuKeys = useSelector(openMenusSelector)

  useEffect(() => {
    !allKeywords.length && dispatch(fetchKeywordsList())
  }, [allKeywords.length, dispatch])

  useEffect(() => {
    videoPreviewRef?.current && (videoPreviewRef.current.style.height = menuRef?.current?.style.width || '')
  }, [menuRef, videoPreviewRef])

  const handleTitleClick = (keys: string | string[]) => {
    const keysArr = isMainMenuKeysArray(keys) ? keys : ([keys] as MainMenuKeys[])

    const clearSelectedListWhenCloseEditors = () => {
      const closingKey = difference(openMenuKeys, keysArr)[0]
      const isClosingPropertyAfterEdit = closingKey === MainMenuKeys.PROPERTIES
        && !keysArr.includes(MainMenuKeys.EDIT)
        && !keysArr.includes(MainMenuKeys.EDIT_BULK)
      const needClearing = isClosingPropertyAfterEdit
      || closingKey === MainMenuKeys.EDIT
      || closingKey === MainMenuKeys.EDIT_BULK
      needClearing && clearSelectedList()
    }

    const openingKey = difference(keysArr, openMenuKeys)[0]
    const openKeysSet = new Set(keysArr)
    openingKey === MainMenuKeys.EDIT && openKeysSet.delete(MainMenuKeys.EDIT_BULK) && clearSelectedList()
    openingKey === MainMenuKeys.EDIT_BULK && openKeysSet.delete(MainMenuKeys.EDIT) && clearSelectedList()
    clearSelectedListWhenCloseEditors()
    setOpenMenus(Array.from(openKeysSet))
    setTimeout(() => {
      dispatch(stopVideoPreview())
    }, 300) // Wait for collapse animation
  }

  return (
    <Sider theme="light" className={styles.sider} ref={menuRef} width={defaultMenuWidth}>
      <Collapse
        className={styles.panelBody}
        defaultActiveKey={openMenuKeys}
        activeKey={openMenuKeys}
        onChange={handleTitleClick}
        expandIconPosition="end"
        items={collapseMenu}
      />
      {extraMenu.map(({ key, children }) => (
        <div key={key} className={styles.extraMenu}>
          {children}
        </div>
      ))}
    </Sider>
  )
}

export default MainMenu
