import React from 'react'
import { useSelector } from 'react-redux'

import { DownCircleTwoTone, UpCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import { Button, Checkbox, Segmented } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import cn from 'classnames'

import { Sort } from 'src/common/constants'
import { fetchPhotos } from 'src/redux/reducers/mainPageSlice/thunks'
import { applySorting } from 'src/redux/reducers/uploadSlice/thunks/applySorting'
import { getIsCurrentPage } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import type { GallerySortingItem, SortingFields } from 'src/redux/types'

import { SortableList } from './components'
import { DragHandle, SortableItem } from './components/SortableList/components'
import { useSortingMenu } from './hooks'

import styles from './SortingMenu.module.scss'

const switcherOptions = [
  {
    label: ' ASC',
    value: Sort.ASC,
    icon: <DownCircleTwoTone />,
  },
  {
    label: ' DESC',
    value: Sort.DESC,
    icon: <UpCircleTwoTone />,
  },
  {
    label: ' OFF',
    value: 0,
    icon: <CloseCircleTwoTone />,
  },
]

export const SortingMenu = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getIsCurrentPage)
  const {
    gallerySortingList, randomSort, groupedByDate, setSortingList, resetSort, setRandomSort, setGroupedByDate,
  } = useSortingMenu()

  const handleSortingChange = (updatedList: GallerySortingItem[]) => {
    setSortingList(updatedList)
  }

  const handleSegmentedChange = (id: SortingFields) => (value: string | number) => {
    const sortValue = value === 0 ? null : (value as Sort)
    const updatedList: GallerySortingItem[] = gallerySortingList
      .map(sortItem => (sortItem.id === id ? { ...sortItem, sort: sortValue } : sortItem))
    setSortingList(updatedList)
  }

  const handleApply = () => {
    isMainPage && dispatch(fetchPhotos())
    isUploadPage && dispatch(applySorting())
  }

  const handleReset = () => {
    resetSort()
  }

  const handleRandomSortChange = (e: CheckboxChangeEvent) => {
    setRandomSort(e.target.checked)
  }

  const handleGroupByDateChange = (e: CheckboxChangeEvent) => {
    setGroupedByDate(e.target.checked)
  }

  return (
    <div className="d-flex flex-column gap-10">
      <SortableList
        items={gallerySortingList}
        onChange={handleSortingChange}
        renderItem={({ id, label, sort }) => (
          <SortableItem id={id}>
            <span className={cn({ [styles.disabled]: randomSort || !sort })}>{label}</span>
            <Segmented
              className={styles.segmentedWrapper}
              value={sort || 0}
              onChange={handleSegmentedChange(id)}
              options={switcherOptions}
              size="small"
            />
            <DragHandle />
          </SortableItem>
        )}
      />

      <div className="d-flex flex-column">
        {isMainPage && (
          <Checkbox checked={randomSort} onChange={handleRandomSortChange}>
            Random sort
          </Checkbox>
        )}

        <Checkbox checked={groupedByDate} onChange={handleGroupByDateChange}>
          Grouped by date
        </Checkbox>
      </div>

      <div className="d-flex justify-content-end align-items-center gap-10">
        <Button className="margin-left-auto" onClick={handleReset}>
          Reset
        </Button>

        <Button type="primary" onClick={handleApply}>
          {isMainPage && 'Reload data'}
          {isUploadPage && 'Apply sorting'}
        </Button>
      </div>
    </div>
  )
}
