import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AutoComplete, Button, Checkbox, Form, Input, Modal, Rate, Select } from 'antd'
import { useSelector } from 'react-redux'
import { compose, identity, sortBy } from 'ramda'
import moment from 'moment'
import type { Moment } from 'moment'
import cn from 'classnames'

import momentGenerateConfig from 'rc-picker/lib/generate/moment'
import generatePicker from 'antd/es/date-picker/generatePicker'

import { getFilePathWithoutName, getLastItem, getNameParts, removeExtraFirstSlash } from '../../common/utils'
import { isDeleteProcessing, main, pathsArrOptionsSelector } from '../../../redux/selectors'
import { useCurrentPage, useFinishEdit } from '../../common/hooks'
import { deleteConfirmation } from '../../../assets/config/moduleConfig'
import { removeFileFromUploadState } from '../../../redux/reducers/uploadSlice/thunks'
import { dateTimeFormat } from '../../common/utils/date'
import { removeCurrentPhoto } from '../../../redux/reducers/mainPageSlice/thunks'
import type { Checkboxes, FieldsObj, UploadingObject } from '../../../redux/types'

import styles from './index.module.scss'
import { useAppDispatch } from '../../../redux/store/store'
import { defaultTimeStamp } from '../../common/utils/date/dateFormats'
import { isVideoByExt } from '../../common/utils/utils'

const { TextArea } = Input
const DatePicker = generatePicker<Moment>(momentGenerateConfig)

interface Props {
  filesArr: FieldsObj[]
  selectedList: number[]
  isExifLoading: boolean
  sameKeywords: string[]
  allKeywords: string[]
  isEditMany?: boolean
  selectAll?: () => void
  clearAll?: () => void
}

export interface InitialFileObject extends Checkboxes {
  rating: number
  name: string
  originalDate: string | Moment
  filePath: string
  keywords: string[]
  description: string
  timeStamp?: string
}

const initialFileObject: InitialFileObject = {
  rating: 0,
  name: '-',
  originalDate: '',
  filePath: '',
  keywords: [],
  description: '',
  isName: false,
  isOriginalDate: false,
  isFilePath: false,
  isKeywords: false,
  isDescription: false,
  isRating: false,
  isTimeStamp: false,
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
}: Props) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm<InitialFileObject>()
  const [modal, contextHolder] = Modal.useModal()
  const pathsListOptions = useSelector(pathsArrOptionsSelector)
  const isDeleting = useSelector(isDeleteProcessing)
  const { isGalleryLoading } = useSelector(main)
  const [currentFilePath, setCurrentFilePath] = useState('')
  const [isSelectAllBtn, setIsSelectAllBtn] = useState(true)
  const { isMainPage } = useCurrentPage()
  const { name, originalDate, rating, description, timeStamp } = useMemo<UploadingObject | InitialFileObject>(
    () => (!selectedList.length ? initialFileObject : filesArr[getLastItem(selectedList)]),
    [filesArr, selectedList]
  )
  const disabledInputs = useMemo(() => !selectedList.length, [selectedList])
  const { shortName, ext, extWithoutDot } = useMemo(() => getNameParts(name), [name])
  const keywordsOptions = useMemo(() => allKeywords.map(keyword => ({ value: keyword, label: keyword })), [allKeywords])
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
  const isVideoFile = useMemo(() => isVideoByExt(extWithoutDot || ''), [extWithoutDot])

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
      rating,
      description,
      name: shortName,
      originalDate: originalDate === '-' ? '' : moment(originalDate, dateTimeFormat),
      timeStamp: isVideoFile ? timeStamp || defaultTimeStamp : undefined,
      keywords: sortBy(identity, sameKeywords || []),
      filePath: currentFilePath,
      isName: false,
      isOriginalDate: false,
      isKeywords: false,
      isFilePath: false,
      isTimeStamp: false,
    })
  }, [form, shortName, originalDate, sameKeywords, currentFilePath, rating, description, timeStamp, isVideoFile])

  const handleSelectAll = useCallback(() => {
    isSelectAllBtn && selectAll && selectAll()
    !isSelectAllBtn && clearAll && clearAll()
    setIsSelectAllBtn(!isSelectAllBtn)
  }, [clearAll, isSelectAllBtn, selectAll])

  const isDeleteBtn = !(isMainPage && isEditMany)
  const showTimeStamp = isMainPage && isVideoFile && !isEditMany

  const refreshTimeStamp = () => form.setFieldsValue({ timeStamp: defaultTimeStamp })

  const handleDelete = () => {
    const onOk = () => {
      isMainPage ? dispatch(removeCurrentPhoto()) : dispatch(removeFileFromUploadState())
    }
    modal.confirm(deleteConfirmation({ onOk, type: 'file' }))
  }

  return (
    <div>
      <Form form={form} name="editForm" onFinish={onFinish}>
        <div className="d-flex">
          <Form.Item className={styles.checkbox} name="isRating" valuePropName="checked">
            <Checkbox>Rating:</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name="rating">
            <Rate disabled={disabledInputs} />
          </Form.Item>
        </div>

        <div className="d-flex">
          <Form.Item className={styles.checkbox} name="isName" valuePropName="checked">
            <Checkbox>Name:</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name="name">
            <Input placeholder="Edit name" disabled={disabledInputs} allowClear />
          </Form.Item>
          <span className={cn({ [styles.extension]: ext }, 'd-block')}>{ext}</span>
        </div>

        <div className="d-flex">
          <Form.Item className={styles.checkbox} name="isOriginalDate" valuePropName="checked">
            <Checkbox>OriginalDate:</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name="originalDate">
            <DatePicker format={dateTimeFormat} placeholder="Edit date" disabled={disabledInputs} className="w-100" />
          </Form.Item>
        </div>

        {isMainPage && (
          <div className="d-flex">
            <Form.Item className={styles.checkbox} name="isFilePath" valuePropName="checked">
              <Checkbox>File path:</Checkbox>
            </Form.Item>
            <Form.Item className={styles.inputField} name="filePath">
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
          </div>
        )}

        <div className="d-flex">
          <Form.Item className={styles.checkbox} name="isKeywords" valuePropName="checked">
            <Checkbox>Keywords:</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name="keywords">
            <Select
              className={styles.keywords}
              mode="tags"
              placeholder="Edit keywords"
              disabled={disabledInputs}
              options={keywordsOptions}
            />
          </Form.Item>
        </div>

        <div className="d-flex">
          <Form.Item className={styles.checkbox} name="isDescription" valuePropName="checked">
            <Checkbox>Description:</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name="description">
            <TextArea
              className={styles.textArea}
              placeholder="maxLength is 2000"
              maxLength={2000}
              disabled={disabledInputs}
              showCount
            />
          </Form.Item>
        </div>

        {showTimeStamp && (
          <div className="d-flex">
            <Form.Item className={styles.checkbox} name="isTimeStamp" valuePropName="checked">
              <Checkbox>TimeStamp:</Checkbox>
            </Form.Item>
            <Form.Item className={styles.inputField} name="timeStamp">
              <Input placeholder="Edit time stamp" disabled={disabledInputs} />
            </Form.Item>
            <Button className="margin-left-10" onClick={refreshTimeStamp}>
              refresh
            </Button>
          </div>
        )}

        <div className={cn(styles.buttonsWrapper, 'd-flex')}>
          <Form.Item className={styles.button}>
            <Button
              className="w-100"
              type="primary"
              htmlType="submit"
              loading={isGalleryLoading || isExifLoading}
              disabled={disabledInputs}
            >
              Edit
            </Button>
          </Form.Item>
          {isEditMany && (
            <Form.Item className={styles.button}>
              <Button
                className="w-100"
                onClick={handleSelectAll}
                type="primary"
                loading={isGalleryLoading || isExifLoading}
              >
                {isSelectAllBtn ? 'Select all' : 'Unselect all'}
              </Button>
            </Form.Item>
          )}
        </div>

        {isDeleteBtn && (
          <Form.Item className={styles.deleteButton}>
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
        )}
      </Form>
      {contextHolder}
    </div>
  )
}

export default EditMenu
