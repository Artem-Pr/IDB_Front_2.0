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
import { folderElement, isDeleteProcessing, main, pathsArrOptionsSelector } from '../../../redux/selectors'
import { useCurrentPage, useFinishEdit } from '../../common/hooks'
import { deleteConfirmation } from '../../../assets/config/moduleConfig'
import { removeFileFromUploadState } from '../../../redux/reducers/uploadSlice/thunks'
import { dateTimeFormat } from '../../common/utils/date'
import { removeCurrentPhoto } from '../../../redux/reducers/mainPageSlice/thunks'
import type { Checkboxes, UploadingObject } from '../../../redux/types'

import styles from './index.module.scss'
import { useAppDispatch } from '../../../redux/store/store'
import { defaultTimeStamp } from '../../common/utils/date/dateFormats'
import { isVideoByExt } from '../../common/utils/utils'
import { TimeDifferenceModal } from './Components'
import {
  useClearSelectedList,
  useFilesList,
  useIsExifLoading,
  useSameKeywords,
  useSelectAll,
  useSelectedList,
} from '../../common/hooks/hooks'

const { TextArea } = Input
const DatePicker = generatePicker<Moment>(momentGenerateConfig)

interface Props {
  isEditMany?: boolean
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
  needUpdatePreview: false,
}

const EditMenu = ({ isEditMany }: Props) => {
  const dispatch = useAppDispatch()
  const { selectAll } = useSelectAll()
  const { clearSelectedList } = useClearSelectedList()
  const { isExifLoading } = useIsExifLoading()
  const { sameKeywords } = useSameKeywords()
  const { keywordsList: allKeywords } = useSelector(folderElement)
  const [form] = Form.useForm<InitialFileObject>()
  const [modal, contextHolder] = Modal.useModal()
  const { filesArr } = useFilesList()
  const { selectedList } = useSelectedList()
  const pathsListOptions = useSelector(pathsArrOptionsSelector)
  const isDeleting = useSelector(isDeleteProcessing)
  const { isGalleryLoading } = useSelector(main)
  const [isSelectAllBtn, setIsSelectAllBtn] = useState(true)
  const { isMainPage } = useCurrentPage()

  const { name, originalDate, rating, description, timeStamp, needUpdatePreview } = useMemo<
    UploadingObject | InitialFileObject
  >(() => (!selectedList.length ? initialFileObject : filesArr[getLastItem(selectedList)]), [filesArr, selectedList])

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

  const lastSelectedElemFilePath = useMemo(() => {
    const filePath = filesArr[getLastItem(selectedList)]?.filePath || ''
    return compose(getFilePathWithoutName, removeExtraFirstSlash)(filePath)
  }, [filesArr, selectedList])

  useEffect(() => {
    const currentFilePath = form.getFieldValue('filePath') as string
    const isFilePathChanged = lastSelectedElemFilePath !== currentFilePath
    isFilePathChanged && form.setFieldsValue({ filePath: lastSelectedElemFilePath })
  }, [form, lastSelectedElemFilePath])

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
      isName: false,
      isOriginalDate: false,
      isKeywords: false,
      isFilePath: false,
      isTimeStamp: false,
      needUpdatePreview: false,
    })
  }, [form, shortName, originalDate, sameKeywords, rating, description, timeStamp, isVideoFile])

  const handleFinish = (values: InitialFileObject) => {
    form.setFieldsValue({
      isName: false,
      isOriginalDate: false,
      isKeywords: false,
      isFilePath: false,
      isTimeStamp: false,
      needUpdatePreview: false,
    })
    onFinish(values)
  }

  const handleSelectAll = useCallback(() => {
    isSelectAllBtn && selectAll()
    !isSelectAllBtn && clearSelectedList()
    setIsSelectAllBtn(!isSelectAllBtn)
  }, [clearSelectedList, isSelectAllBtn, selectAll])

  const isDeleteBtn = !(isMainPage && isEditMany)
  const showTimeStamp = isMainPage && isVideoFile && !isEditMany && !needUpdatePreview

  const refreshTimeStamp = () => form.setFieldsValue({ timeStamp: defaultTimeStamp })

  const handleDelete = () => {
    const onOk = () => {
      isMainPage ? dispatch(removeCurrentPhoto()) : dispatch(removeFileFromUploadState())
    }
    modal.confirm(deleteConfirmation({ onOk, type: 'file' }))
  }

  return (
    <div>
      <Form form={form} onFinish={handleFinish} disabled={disabledInputs}>
        <div className="d-flex">
          <Form.Item className={styles.checkbox} name="isRating" valuePropName="checked">
            <Checkbox>Rating:</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name="rating">
            <Rate />
          </Form.Item>
        </div>

        <div className="d-flex">
          <Form.Item className={styles.checkbox} name="isName" valuePropName="checked">
            <Checkbox>Name:</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name="name">
            <Input placeholder="Edit name" allowClear />
          </Form.Item>
          <span className={cn({ [styles.extension]: ext }, 'd-block')}>{ext}</span>
        </div>

        <div className="d-flex">
          <Form.Item className={styles.checkbox} name="isOriginalDate" valuePropName="checked">
            <Checkbox>OriginalDate:</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name="originalDate">
            <DatePicker format={dateTimeFormat} placeholder="Edit date" className="w-100" showTime />
          </Form.Item>
          <TimeDifferenceModal />
        </div>

        {isMainPage && (
          <div className="d-flex">
            <Form.Item className={styles.checkbox} name="isFilePath" valuePropName="checked">
              <Checkbox>File path:</Checkbox>
            </Form.Item>
            <Form.Item className={styles.inputField} name="filePath">
              <AutoComplete
                placeholder="Edit file path"
                options={pathsListOptions}
                // onChange={(value: string) => setCurrentFilePath(value)}
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
            <Select className={styles.keywords} mode="tags" placeholder="Edit keywords" options={keywordsOptions} />
          </Form.Item>
        </div>

        <div className="d-flex">
          <Form.Item className={styles.checkbox} name="isDescription" valuePropName="checked">
            <Checkbox>Description:</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name="description">
            <TextArea className={styles.textArea} placeholder="maxLength is 2000" maxLength={2000} showCount />
          </Form.Item>
        </div>

        {showTimeStamp ? (
          <div className="d-flex">
            <Form.Item className={styles.checkbox} name="isTimeStamp" valuePropName="checked">
              <Checkbox>TimeStamp:</Checkbox>
            </Form.Item>
            <Form.Item className={styles.inputField} name="timeStamp">
              <Input placeholder="Edit time stamp" />
            </Form.Item>
            <Button className="margin-left-10" onClick={refreshTimeStamp}>
              refresh
            </Button>
          </div>
        ) : (
          <div className="d-flex">
            <Form.Item className={styles.checkbox} name="needUpdatePreview" valuePropName="checked">
              <Checkbox>Update preview</Checkbox>
            </Form.Item>
          </div>
        )}

        <div className={cn(styles.buttonsWrapper, 'd-flex')}>
          <Form.Item className={styles.button}>
            <Button className="w-100" type="primary" htmlType="submit" loading={isGalleryLoading || isExifLoading}>
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
                disabled={false}
              >
                {isSelectAllBtn ? 'Select all' : 'Unselect all'}
              </Button>
            </Form.Item>
          )}
        </div>

        {isDeleteBtn && (
          <Form.Item className={styles.deleteButton}>
            <Button className="w-100" type="primary" loading={isDeleting} onClick={handleDelete} danger>
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
