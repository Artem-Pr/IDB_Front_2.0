import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Checkbox, Segmented } from 'antd'
import { DownCircleTwoTone, UpCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'

import cn from 'classnames'

import { CheckboxChangeEvent } from 'antd/es/checkbox'

import { SortableList } from './components'

import { main } from '../../../redux/selectors'
import type { GallerySortingItem } from '../../../redux/types'
import { Sort, SortedFields } from '../../../redux/types'
import { setGallerySortingList, setRandomSort } from '../../../redux/reducers/mainPageSlice/mainPageSlice'
import { DragHandle, SortableItem } from './components/SortableList/components'

import styles from './SortingMenu.module.scss'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice/thunks'

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
  const dispatch = useDispatch()
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

      <div className="d-flex gap-10 justify-content-between align-items-center">
        <Checkbox onChange={handleRandomSortChange}>Random sort</Checkbox>

        <Button type="primary" onClick={handleDataReload}>
          Reload data
        </Button>
      </div>
    </div>
  )
}
