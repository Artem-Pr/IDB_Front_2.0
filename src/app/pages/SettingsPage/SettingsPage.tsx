import React, { Fragment, Key } from 'react'

import { Divider } from 'antd'
import cn from 'classnames'

import {
  CreatePreviews,
  IsVideoPreviewMuted,
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
    label: 'Is video preview muted',
    component: <IsVideoPreviewMuted />,
  },
  {
    label: 'Min image slide limit',
    component: <MinImageSlideLimit />,
  },
  {
    label: 'Max image slide limit',
    component: <MaxImageSlideLimit />,
  },
  {
    label: 'Pagination options',
    component: <PaginationOptions />,
  },
  {
    label: 'Unused keywords',
    component: <UnusedKeywords />,
  },
  {
    label: 'Sync previews',
    component: <SyncPreviews />,
    className: styles.syncPreviewsRow,
  },
  {
    label: 'Create previews',
    component: <CreatePreviews />,
    className: styles.syncPreviewsRow,
  },
  {
    label: 'Update EXIF',
    component: <UpdateExif />,
    className: styles.updateExifRow,
  },
].map((item, key) => ({ ...item, key }))

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
