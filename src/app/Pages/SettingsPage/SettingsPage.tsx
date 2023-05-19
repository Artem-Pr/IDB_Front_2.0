import React, { Key } from 'react'
import cn from 'classnames'

import styles from './SettingsPage.module.scss'
import {
  FullSizePreview,
  MaxImageSlideLimit,
  MinImageSlideLimit,
  PaginationOptions,
  SavePreview,
  UnusedKeywords,
} from './components'

interface SettingItem {
  key: Key
  label: string
  component: React.ReactNode
}

const settingsList: SettingItem[] = [
  {
    key: '0',
    label: 'Full size preview',
    component: <FullSizePreview />,
  },
  {
    key: '1',
    label: 'Save preview',
    component: <SavePreview />,
  },
  {
    key: '2',
    label: 'Min image slide limit',
    component: <MinImageSlideLimit />,
  },
  {
    key: '3',
    label: 'Max image slide limit',
    component: <MaxImageSlideLimit />,
  },
  {
    key: '4',
    label: 'Pagination options',
    component: <PaginationOptions />,
  },
  {
    key: '5',
    label: 'Unused keywords',
    component: <UnusedKeywords />,
  },
]

export const SettingsPage = () => (
  <div className={styles.wrapper}>
    <div className={cn(styles.gridWrapper, 'd-grid')}>
      {settingsList.map(({ key, label, component }) => (
        <div className={cn(styles.gridRow, 'd-grid')} key={key}>
          <span>{label}</span>
          {component}
        </div>
      ))}
    </div>
  </div>
)
