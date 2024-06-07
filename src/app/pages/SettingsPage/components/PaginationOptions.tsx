import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Select } from 'antd'
import { sort } from 'ramda'

import { setGalleryPagination } from 'src/redux/reducers/mainPageSlice/mainPageSlice'
import { pagination } from 'src/redux/selectors'

const getFilteredOptions = (values: number[]) => ({ pageSizeOptions: sort((a, b) => a - b, values) })
const pageSizeOptions = [
  5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 250, 300,
].map(item => ({ label: item, value: item }))

export const PaginationOptions = memo(() => {
  const dispatch = useDispatch()
  const { pageSizeOptions: pageSizeSelectedOptions } = useSelector(pagination)

  const handlePageSizeListChange = (values: number[]) => {
    values.length > 0 && dispatch(setGalleryPagination(getFilteredOptions(values)))
  }

  return (
    <Select
      mode="multiple"
      value={pageSizeSelectedOptions}
      defaultValue={pageSizeSelectedOptions}
      onChange={handlePageSizeListChange}
      options={pageSizeOptions}
    />
  )
})
