import React, { Fragment, Key } from 'react'

import { Divider } from 'antd'
import cn from 'classnames'

import {
  CreatePreviews,
  MaxImageSlideLimit,
  MinImageSlideLimit,
  PaginationOptions,
  SyncPreviews,
  UnusedKeywords,
  UpdateExif,
} from './components'

import styles from './SettingsPage.module.scss'

interface SettingItem {
  key: Key
  label: string
  component: React.ReactNode
  className?: string
}

const settingsList: SettingItem[] = [
  {
    key: '0',
    label: 'Min image slide limit',
    component: <MinImageSlideLimit />,
  },
  {
    key: '1',
    label: 'Max image slide limit',
    component: <MaxImageSlideLimit />,
  },
  {
    key: '2',
    label: 'Pagination options',
    component: <PaginationOptions />,
  },
  {
    key: '3',
    label: 'Unused keywords',
    component: <UnusedKeywords />,
  },
  {
    key: '4',
    label: 'Sync previews',
    component: <SyncPreviews />,
    className: styles.syncPreviewsRow,
  },
  {
    key: '5',
    label: 'Create previews',
    component: <CreatePreviews />,
    className: styles.syncPreviewsRow,
  },
  {
    key: '6',
    label: 'Update EXIF',
    component: <UpdateExif />,
    className: styles.updateExifRow,
  },
]

export const SettingsPage = () => (
  <div className={styles.wrapper}>
    <div className={cn(styles.gridWrapper, 'd-grid')}>
      {settingsList.map(({
        key, label, component, className,
      }) => (
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
