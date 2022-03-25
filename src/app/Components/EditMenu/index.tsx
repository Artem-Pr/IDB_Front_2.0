import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AutoComplete, Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose, identity, sortBy } from 'ramda'
import moment from 'moment'
import cn from 'classnames'

import styles from './index.module.scss'
import { Checkboxes, ExtraDownloadingFields, UploadingObject } from '../../../redux/types'
import {
  dateFormat,
  getFilePathWithoutName,
  getLastItem,
  getNameParts,
  removeExtraFirstSlash,
} from '../../common/utils'
import { isDeleteProcessing, main, pathsArrOptionsSelector } from '../../../redux/selectors'
import { useFinishEdit } from '../../common/hooks/useFinishEdit'
import { deleteConfirmation } from '../../../assets/config/moduleConfig'
import { removeCurrentPhoto } from '../../../redux/reducers/mainPageSlice-reducer'
import { removeFileFromUploadState } from '../../../redux/reducers/uploadSlice-reducer'

const { Option } = Select

interface Props {
  filesArr: Array<UploadingObject & ExtraDownloadingFields>
  selectedList: number[]
  isExifLoading: boolean
  sameKeywords: string[]
  allKeywords: string[]
  isEditMany?: boolean
  selectAll?: () => void
  clearAll?: () => void
  isMainPage: boolean
}

interface InitialFileObject extends Checkboxes {
  name: string
  originalDate: string
  filePath: string
  keywords: string[]
}

const initialFileObject: InitialFileObject = {
  name: '-',
  originalDate: '',
  filePath: '',
  keywords: [],
  isName: false,
  isOriginalDate: false,
  isFilePath: false,
  isKeywords: false,
}

const EditMenu = ({
  filesArr,
  selectedList,
  sameKeywords,
  isEditMany,
  selectAll,
  clearAll,
  isExifLoading,
  allKeywords,
  isMainPage,
}: Props) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [modal, contextHolder] = Modal.useModal()
  const pathsListOptions = useSelector(pathsArrOptionsSelector)
  const isDeleting = useSelector(isDeleteProcessing)
  const { isGalleryLoading } = useSelector(main)
  const [currentFilePath, setCurrentFilePath] = useState('')
  const [isSelectAllBtn, setIsSelectAllBtn] = useState(true)
  const { name, originalDate } = useMemo<UploadingObject | InitialFileObject>(
    () => (!selectedList.length ? initialFileObject : filesArr[getLastItem(selectedList)]),
    [filesArr, selectedList]
  )
  const disabledInputs = useMemo(() => !selectedList.length, [selectedList])
  const { shortName, ext } = useMemo(() => getNameParts(name), [name])
  const { onFinish } = useFinishEdit({
    filesArr,
    sameKeywords,
    selectedList,
    ext,
    name,
    isMainPage,
    isEditMany,
    modal,
  })

  useEffect(() => {
    const getFilePath = () => {
      const filePath = filesArr[getLastItem(selectedList)].filePath || ''
      return compose(getFilePathWithoutName, removeExtraFirstSlash)(filePath)
    }
    isMainPage && selectedList.length && setCurrentFilePath(getFilePath())
  }, [filesArr, isMainPage, selectedList])

  useEffect(() => {
    !selectedList.length && setIsSelectAllBtn(true)
    selectedList.length === filesArr.length && setIsSelectAllBtn(false)
  }, [selectedList.length, filesArr.length])

  useEffect(() => {
    form.setFieldsValue({
      name: shortName,
      originalDate: originalDate === '-' ? '' : moment(originalDate, dateFormat),
      keywords: sortBy(identity, sameKeywords || []),
      filePath: currentFilePath,
      isName: false,
      isOriginalDate: false,
      isKeywords: false,
      isFilePath: false,
    })
  }, [form, shortName, originalDate, sameKeywords, currentFilePath])

  const handleSelectAll = useCallback(() => {
    isSelectAllBtn && selectAll && selectAll()
    !isSelectAllBtn && clearAll && clearAll()
    setIsSelectAllBtn(!isSelectAllBtn)
  }, [clearAll, isSelectAllBtn, selectAll])

  const isDeleteBtn = useMemo(() => !(isMainPage && isEditMany), [isEditMany, isMainPage])

  const handleDelete = () => {
    const onOk = () => {
      isMainPage ? dispatch(removeCurrentPhoto()) : dispatch(removeFileFromUploadState())
    }
    modal.confirm(deleteConfirmation({ onOk, type: 'file' }))
  }

  return (
    <div>
      <Form form={form} name="editForm" onFinish={onFinish}>
        <Row className={styles.item} gutter={10}>
          <Col span={8} offset={1} style={{ textAlign: 'left' }}>
            <Form.Item name="isName" valuePropName="checked">
              <Checkbox>Name:</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="name">
              <Input placeholder="Edit name" disabled={disabledInputs} allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <span className={cn(styles.extension, 'd-block')}>{ext}</span>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={8} offset={1} style={{ textAlign: 'left' }}>
            <Form.Item name="isOriginalDate" valuePropName="checked">
              <Checkbox>OriginalDate:</Checkbox>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item name="originalDate">
              <DatePicker format={dateFormat} placeholder="Edit date" disabled={disabledInputs} className="w-100" />
            </Form.Item>
          </Col>
        </Row>

        {isMainPage && (
          <Row gutter={10}>
            <Col span={8} offset={1} style={{ textAlign: 'left' }}>
              <Form.Item name="isFilePath" valuePropName="checked">
                <Checkbox>File path:</Checkbox>
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="filePath">
                <AutoComplete
                  disabled={disabledInputs}
                  placeholder="Edit file path"
                  options={pathsListOptions}
                  onChange={(value: string) => setCurrentFilePath(value)}
                  filterOption={(inputValue, option) =>
                    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={10}>
          <Col span={8} offset={1} style={{ textAlign: 'left' }}>
            <Form.Item name="isKeywords" valuePropName="checked">
              <Checkbox>Keywords:</Checkbox>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item name="keywords">
              <Select className={styles.keywords} mode="tags" placeholder="Edit keywords" disabled={disabledInputs}>
                {allKeywords &&
                  allKeywords.map(keyword => (
                    <Option key={keyword} value={keyword}>
                      {keyword}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={7} offset={isDeleteBtn && isEditMany ? 2 : 9}>
            <Form.Item>
              <Button
                className="w-100"
                style={{ marginRight: 10 }}
                type="primary"
                htmlType="submit"
                loading={isGalleryLoading || isExifLoading}
                disabled={disabledInputs}
              >
                Edit
              </Button>
            </Form.Item>
          </Col>
          {isEditMany && (
            <Col span={7}>
              <Form.Item>
                <Button
                  className="w-100"
                  onClick={handleSelectAll}
                  type="primary"
                  loading={isGalleryLoading || isExifLoading}
                >
                  {isSelectAllBtn ? 'Select all' : 'Unselect all'}
                </Button>
              </Form.Item>
            </Col>
          )}
          {isDeleteBtn && (
            <Col span={7}>
              <Form.Item>
                <Button
                  className="w-100"
                  type="primary"
                  disabled={disabledInputs}
                  loading={isDeleting}
                  onClick={handleDelete}
                  danger
                >
                  Delete
                </Button>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
      {contextHolder}
    </div>
  )
}

export default EditMenu
