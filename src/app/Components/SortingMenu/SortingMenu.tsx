import React from 'react'
import { useSelector } from 'react-redux'

import { Button, Checkbox, Segmented } from 'antd'
import { DownCircleTwoTone, UpCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'

import cn from 'classnames'

import { CheckboxChangeEvent } from 'antd/es/checkbox'

import { SortableList } from './components'

import { main } from '../../../redux/selectors'
import type { GallerySortingItem } from '../../../redux/types'
import { Sort, SortedFields } from '../../../redux/types'
import { resetSort, setGallerySortingList, setRandomSort } from '../../../redux/reducers/mainPageSlice/mainPageSlice'
import { DragHandle, SortableItem } from './components/SortableList/components'

import styles from './SortingMenu.module.scss'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice/thunks'
import { useAppDispatch } from '../../../redux/store/store'

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
  const { gallerySortingList, randomSort } = useSelector(main)

  const handleSortingChange = (updatedList: GallerySortingItem[]) => {
    dispatch(setGallerySortingList(updatedList))
  }

  const handleSegmentedChange = (id: SortedFields) => (value: string | number) => {
    const sortValue = value === 0 ? null : (value as Sort)
    const updatedList: GallerySortingItem[] = gallerySortingList.map(sortItem => {
      return sortItem.id === id ? { ...sortItem, sort: sortValue } : sortItem
    })
    dispatch(setGallerySortingList(updatedList))
  }

  const handleDataReload = () => {
    dispatch(fetchPhotos())
  }

  const handleReset = () => {
    dispatch(resetSort())
  }

  const handleRandomSortChange = (e: CheckboxChangeEvent) => {
    dispatch(setRandomSort(e.target.checked))
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

      <div className="d-flex justify-content-between align-items-center gap-10">
        <Checkbox checked={randomSort} onChange={handleRandomSortChange}>
          Random sort
        </Checkbox>

        <Button className="margin-left-auto" onClick={handleReset}>
          Reset
        </Button>

        <Button type="primary" onClick={handleDataReload}>
          Reload data
        </Button>
      </div>
    </div>
  )
}
