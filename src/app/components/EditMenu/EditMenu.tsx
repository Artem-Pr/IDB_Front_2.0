import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import { useSelector } from 'react-redux'

import {
  AutoComplete, Button, Checkbox, Form, Input, Modal, Rate, Select, DatePicker,
} from 'antd'
import cn from 'classnames'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { compose, identity, sortBy } from 'ramda'

import type { Media, MediaChangeable } from 'src/api/models/media'
import { deleteConfirmation } from 'src/assets/config/moduleConfig'
import { removeCurrentPhoto } from 'src/redux/reducers/mainPageSlice/thunks'
import { removeFileFromUploadState } from 'src/redux/reducers/uploadSlice/thunks'
import {
  folderElement, isDeleteProcessing, main, pathsArrOptionsSelector,
} from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import type { Checkboxes } from 'src/redux/types'

import { useCurrentPage, useFinishEdit } from '../../common/hooks'
import {
  useClearSelectedList,
  useFilesList,
  useSameKeywords,
  useSelectAll,
  useSelectedList,
} from '../../common/hooks/hooks'
import {
  getFilePathWithoutName, getLastItem, getNameParts, removeExtraFirstSlash,
  isVideoByExt,
} from '../../common/utils'
import { DATE_TIME_FORMAT } from '../../common/utils/date'
import { DEFAULT_TIME_STAMP } from '../../common/utils/date/dateFormats'

import { mediaFields } from './EditMenuConfig'
import { TimeDifferenceModal } from './components'

import styles from './EditMenu.module.scss'

const { TextArea } = Input

interface Props {
  isEditMany?: boolean
}

export interface InitialFormData extends Checkboxes, Omit<MediaChangeable, 'originalName' | 'filePath' | 'originalDate'> {
  originalName: string
  filePath: string
  originalDate: Dayjs | null
}

const initialFormData: InitialFormData = {
  rating: 0,
  originalName: '-',
  originalDate: null,
  filePath: '',
  keywords: [],
  description: '',
  timeStamp: DEFAULT_TIME_STAMP,
  isName: false,
  isOriginalDate: false,
  isFilePath: false,
  isKeywords: false,
  isDescription: false,
  isRating: false,
  isTimeStamp: false,
}

export const EditMenu = ({ isEditMany }: Props) => {
  const dispatch = useAppDispatch()
  const { selectAll } = useSelectAll()
  const { clearSelectedList } = useClearSelectedList()
  const { sameKeywords } = useSameKeywords()
  const { keywordsList: allKeywords } = useSelector(folderElement)
  const [form] = Form.useForm<InitialFormData>()
  const [modal, contextHolder] = Modal.useModal()
  const { filesArr } = useFilesList()
  const { selectedList } = useSelectedList()
  const pathsListOptions = useSelector(pathsArrOptionsSelector)
  const isDeleting = useSelector(isDeleteProcessing)
  const { isGalleryLoading } = useSelector(main)
  const [isSelectAllBtn, setIsSelectAllBtn] = useState(true)
  const { isMainPage } = useCurrentPage()

  const {
    originalName, originalDate, rating, description, timeStamp,
  } = useMemo<
  Media | InitialFormData
  >(() => (!selectedList.length ? initialFormData : filesArr[getLastItem(selectedList)]), [filesArr, selectedList])

  const disabledInputs = useMemo(() => !selectedList.length, [selectedList])
  const { shortName, ext, extWithoutDot } = useMemo(() => getNameParts(originalName), [originalName])
  const keywordsOptions = useMemo(() => allKeywords.map(keyword => ({ value: keyword, label: keyword })), [allKeywords])
  const { onFinish } = useFinishEdit({
    filesArr,
    sameKeywords,
    selectedList,
    ext,
    originalName,
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
      originalName: shortName,
      originalDate: dayjs(originalDate, DATE_TIME_FORMAT),
      timeStamp: isVideoFile ? timeStamp || DEFAULT_TIME_STAMP : undefined,
      keywords: sortBy(identity, sameKeywords || []),
      isName: false,
      isOriginalDate: false,
      isKeywords: false,
      isFilePath: false,
      isTimeStamp: false,
    })
  }, [form, shortName, originalDate, sameKeywords, rating, description, timeStamp, isVideoFile])

  const handleFinish = (values: InitialFormData) => {
    form.setFieldsValue({
      isRating: false,
      isName: false,
      isOriginalDate: false,
      isKeywords: false,
      isFilePath: false,
      isTimeStamp: false,
      isDescription: false,
    })
    onFinish(values)
  }

  const handleSelectAll = useCallback(() => {
    isSelectAllBtn && selectAll()
    !isSelectAllBtn && clearSelectedList()
    setIsSelectAllBtn(!isSelectAllBtn)
  }, [clearSelectedList, isSelectAllBtn, selectAll])

  const isDeleteBtn = !(isMainPage && isEditMany)
  const showTimeStamp = isMainPage && isVideoFile && !isEditMany

  const refreshTimeStamp = () => form.setFieldsValue({ timeStamp: DEFAULT_TIME_STAMP })

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
          <Form.Item
            className={styles.checkbox}
            name={mediaFields.rating.checkboxName}
            valuePropName="checked"
          >
            <Checkbox>{mediaFields.rating.label}</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name={mediaFields.rating.name}>
            <Rate />
          </Form.Item>
        </div>

        <div className="d-flex">
          <Form.Item
            className={styles.checkbox}
            name={mediaFields.originalName.checkboxName}
            valuePropName="checked"
          >
            <Checkbox>{mediaFields.originalName.label}</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name={mediaFields.originalName.name}>
            <Input placeholder={mediaFields.originalName.placeholder} allowClear />
          </Form.Item>
          <span className={cn({ [styles.extension]: ext }, 'd-block')}>{ext}</span>
        </div>

        <div className="d-flex">
          <Form.Item
            className={styles.checkbox}
            name={mediaFields.originalDate.checkboxName}
            valuePropName="checked"
          >
            <Checkbox>{mediaFields.originalDate.label}</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name={mediaFields.originalDate.name}>
            <DatePicker
              className="w-100"
              format={DATE_TIME_FORMAT}
              placeholder={mediaFields.originalDate.placeholder}
              showTime
            />
          </Form.Item>
          <TimeDifferenceModal />
        </div>

        {isMainPage && (
          <div className="d-flex">
            <Form.Item
              className={styles.checkbox}
              name={mediaFields.filePath.checkboxName}
              valuePropName="checked"
            >
              <Checkbox>{mediaFields.filePath.label}</Checkbox>
            </Form.Item>
            <Form.Item className={styles.inputField} name={mediaFields.filePath.name}>
              <AutoComplete
                filterOption={(inputValue, option) => option?.value.toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1}
                options={pathsListOptions}
                placeholder={mediaFields.filePath.placeholder}
              />
            </Form.Item>
          </div>
        )}

        <div className="d-flex">
          <Form.Item
            className={styles.checkbox}
            name={mediaFields.keywords.checkboxName}
            valuePropName="checked"
          >
            <Checkbox>{mediaFields.keywords.label}</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name={mediaFields.keywords.name}>
            <Select
              mode="tags"
              options={keywordsOptions}
              placeholder={mediaFields.keywords.placeholder}
            />
          </Form.Item>
        </div>

        <div className="d-flex">
          <Form.Item
            className={styles.checkbox}
            name={mediaFields.description.checkboxName}
            valuePropName="checked"
          >
            <Checkbox>{mediaFields.description.label}</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name={mediaFields.description.name}>
            <TextArea
              className={styles.textArea}
              maxLength={2000}
              placeholder={mediaFields.description.placeholder}
              showCount
            />
          </Form.Item>
        </div>

        {showTimeStamp
          && (
            <div className="d-flex">
              <Form.Item
                className={styles.checkbox}
                name={mediaFields.timeStamp.checkboxName}
                valuePropName="checked"
              >
                <Checkbox>{mediaFields.timeStamp.label}</Checkbox>
              </Form.Item>
              <Form.Item className={styles.inputField} name={mediaFields.timeStamp.name}>
                <Input placeholder={mediaFields.timeStamp.placeholder} />
              </Form.Item>
              <Button className="margin-left-10" onClick={refreshTimeStamp}>
                refresh
              </Button>
            </div>
          )}

        <div className={cn(styles.buttonsWrapper, 'd-flex')}>
          <Form.Item className={styles.button}>
            <Button className="w-100" type="primary" htmlType="submit" loading={isGalleryLoading}>
                Edit
            </Button>
          </Form.Item>
          {isEditMany && (
            <Form.Item className={styles.button}>
              <Button
                className="w-100"
                onClick={handleSelectAll}
                type="primary"
                loading={isGalleryLoading}
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
