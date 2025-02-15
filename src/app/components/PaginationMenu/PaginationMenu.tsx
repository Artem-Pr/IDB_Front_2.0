import React from 'react'
import { useSelector } from 'react-redux'

import { Pagination } from 'antd'

import { setGalleryPagination } from 'src/redux/reducers/mainPageSlice/mainPageSlice'
import { fetchPhotos } from 'src/redux/reducers/mainPageSlice/thunks'
import { pagination } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

export const PaginationMenu = () => {
  const dispatch = useAppDispatch()
  const {
    currentPage, resultsCount, nPerPage, pageSizeOptions,
  } = useSelector(pagination)

  const handleChange = (page: number, pageSize?: number) => {
    const paginationObj = {
      currentPage: pageSize === nPerPage ? page : 1,
      ...(pageSize && { nPerPage: pageSize }),
    }
    dispatch(setGalleryPagination(paginationObj))
    dispatch(fetchPhotos())
  }

  return (
    <Pagination
      style={{ margin: '10px 0 5px 20px' }}
      total={resultsCount}
      showTotal={total => `Total ${total} items`}
      pageSize={nPerPage}
      current={currentPage}
      showSizeChanger
      pageSizeOptions={pageSizeOptions}
      onChange={handleChange}
    />
  )
}
