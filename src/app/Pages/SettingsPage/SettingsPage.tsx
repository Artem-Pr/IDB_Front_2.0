import React, { Fragment, Key } from 'react'
import cn from 'classnames'

import { Divider } from 'antd'

import styles from './SettingsPage.module.scss'
import {
  FullSizePreview,
  MaxImageSlideLimit,
  MinImageSlideLimit,
  PaginationOptions,
  SavePreview,
  SyncPreviews,
  UnusedKeywords,
} from './components'
import { CreatePreviews } from './components/CreatePreviews'

interface SettingItem {
  key: Key
  label: string
  component: React.ReactNode
  className?: string
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
  {
    key: '6',
    label: 'Sync previews',
    component: <SyncPreviews />,
    className: styles.syncPreviewsRow,
  },
  {
    key: '7',
    label: 'Create previews',
    component: <CreatePreviews />,
    className: styles.syncPreviewsRow,
  },
]

export const SettingsPage = () => (
  <div className={styles.wrapper}>
    <div className={cn(styles.gridWrapper, 'd-grid')}>
      {settingsList.map(({ key, label, component, className }) => (
        <Fragment key={key}>
          <div className={cn('d-grid', styles.gridRow, className)}>
            <span>{label}</span>
            {component}
          </div>
          <Divider className="m-5" />
        </Fragment>
      ))}
    </div>
  </div>
)
