import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination } from 'antd'

import { pagination } from '../../../redux/selectors'
import { fetchPhotos, setGalleryPagination } from '../../../redux/reducers/mainPageSlice-reducer'

const option = ['30', '60', '100', '200']

const PaginationMenu = () => {
  const dispatch = useDispatch()
  const { currentPage, resultsCount, nPerPage } = useSelector(pagination)

  const handleChange = (page: number, pageSize?: number) => {
    const paginationObj = { currentPage: pageSize === nPerPage ? page : 1, ...(pageSize && { nPerPage: pageSize }) }
    dispatch(setGalleryPagination(paginationObj))
    dispatch(fetchPhotos())
  }

  return (
    <Pagination
      style={{ margin: '10px 0 0 20px' }}
      total={resultsCount}
      showTotal={total => `Total ${total} items`}
      pageSize={nPerPage}
      current={currentPage}
      showSizeChanger
      pageSizeOptions={option}
      onChange={handleChange}
    />
  )
}

export default PaginationMenu
