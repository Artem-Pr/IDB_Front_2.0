import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination } from 'antd'

import { pagination } from '../../../redux/selectors'
import { setGalleryPagination } from '../../../redux/reducers/mainPageSlice/mainPageSlice'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice/thunks'

const PaginationMenu = () => {
  const dispatch = useDispatch()
  const { currentPage, resultsCount, nPerPage, pageSizeOptions } = useSelector(pagination)

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

export default PaginationMenu
