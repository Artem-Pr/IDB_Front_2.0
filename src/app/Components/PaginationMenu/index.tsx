import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination } from 'antd'

import { pagination } from '../../../redux/selectors'
import { setGalleryPagination } from '../../../redux/reducers/mainPageSlice/mainPageSlice'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice/thunks'
import { ElementsPerPage } from '../../../redux/types'

const option: ElementsPerPage[] = [10, 20, 50, 100]

const PaginationMenu = () => {
  const dispatch = useDispatch()
  const { currentPage, resultsCount, nPerPage } = useSelector(pagination)

  const handleChange = (page: number, pageSize?: number) => {
    const paginationObj = {
      currentPage: pageSize === nPerPage ? page : 1,
      ...(pageSize && { nPerPage: pageSize as ElementsPerPage }),
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
      pageSizeOptions={option.map(String)}
      onChange={handleChange}
    />
  )
}

export default PaginationMenu
