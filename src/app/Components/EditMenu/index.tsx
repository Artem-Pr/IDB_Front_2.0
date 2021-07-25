import React, { useEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Form, Input, Modal, Select, Space } from 'antd'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { curry, identity, isEmpty, sortBy } from 'ramda'

import styles from './index.module.scss'
import { ExtraDownloadingFields, UpdatedObject, UploadingObject } from '../../../redux/types'
import {
  dateFormat,
  getFilesWithUpdatedKeywords,
  getLastItem,
  getNameParts,
  getRenamedObjects,
  removeEmptyFields,
  removeIntersectingKeywords,
} from '../../common/utils'
import { useEditFilesArr } from '../../common/hooks'
import { updatePhotos } from '../../../redux/reducers/mainPageSlice-reducer'

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

interface InitialFileObject {
  name: string
  originalDate: string
  keywords: string[]
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

const initialFileObject: InitialFileObject = {
  name: '-',
  originalDate: '',
  keywords: [],
}

const config = {
  title: 'Duplicate names',
  content: 'Please enter another name',
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
  const [form] = Form.useForm()
  const [modal, contextHolder] = Modal.useModal()
  const dispatch = useDispatch()
  const [isSelectAllBtn, setIsSelectAllBtn] = useState(true)
  const editUploadingFiles = useEditFilesArr(selectedList, filesArr, sameKeywords, isMainPage)
  const { name, originalDate } = useMemo<UploadingObject | InitialFileObject>(
    () => (!selectedList.length ? initialFileObject : filesArr[getLastItem(selectedList)]),
    [filesArr, selectedList]
  )
  const disabledInputs = useMemo(() => !selectedList.length, [selectedList])
  const { shortName, ext } = useMemo(() => getNameParts(name), [name])

  useEffect(() => {
    !selectedList.length && setIsSelectAllBtn(true)
    selectedList.length === filesArr.length && setIsSelectAllBtn(false)
  }, [selectedList.length, filesArr.length])

  useEffect(() => {
    form.setFieldsValue({
      name: shortName,
      originalDate: originalDate === '-' ? '' : moment(originalDate, dateFormat),
      keywords: sortBy(identity, sameKeywords || []),
    })
  }, [form, shortName, originalDate, sameKeywords])

  const fetchUpdatedFiles = (currentName: string, currentOriginalDate: string | null, keywords: string[]) => {
    const selectedFiles = filesArr
      .filter((_, idx) => selectedList.includes(idx))
      .map(({ _id, keywords }) => ({
        _id,
        keywords,
        name: currentName,
      }))
    const newNamesArr: string[] = getRenamedObjects(selectedFiles).map(({ name }) => name)
    const selectedFilesWithoutSameKeywords = removeIntersectingKeywords(sameKeywords, selectedFiles)
    const newKeywordsArr: string[][] = getFilesWithUpdatedKeywords(selectedFilesWithoutSameKeywords, keywords).map(
      ({ keywords }) => keywords || []
    )

    const getUpdatedFields = (idx: number) => {
      return {
        originalName: newNamesArr[idx].startsWith('-') ? undefined : newNamesArr[idx],
        originalDate: currentOriginalDate || undefined,
        keywords: newKeywordsArr[idx],
      }
    }
    const updatedFiles: UpdatedObject[] = selectedFiles.map(({ _id }, i) => ({
      id: _id || '',
      updatedFields: getUpdatedFields(i),
    }))

    updatedFiles.length && dispatch(updatePhotos(updatedFiles))
  }

  const onFinish = ({ name, originalDate, keywords }: any) => {
    const currentName = name ? name + ext : ''
    const currentOriginalDate = originalDate ? moment(originalDate).format(dateFormat) : null
    const isDuplicateName = curry((filesArr: UploadingObject[], currentName: string) => {
      const fileArrNames = filesArr.map(({ name }) => name)
      return fileArrNames.includes(currentName)
    })(filesArr)

    const updateValues = () => {
      const preparedValue = {
        name: currentName,
        originalDate: currentOriginalDate,
        keywords,
      }

      isMainPage && fetchUpdatedFiles(currentName, currentOriginalDate, keywords)
      const editedFields = removeEmptyFields(preparedValue)
      !isEmpty(editedFields) && editUploadingFiles(editedFields)
    }

    const needModalIsDuplicate = !isEditMany && isDuplicateName(name + ext)

    needModalIsDuplicate ? modal.warning(config) : updateValues()
  }

  const handleSelectAll = () => {
    isSelectAllBtn && selectAll && selectAll()
    !isSelectAllBtn && clearAll && clearAll()
    setIsSelectAllBtn(!isSelectAllBtn)
  }

  return (
    <div>
      <Form {...layout} form={form} name="editForm" onFinish={onFinish}>
        <Form.Item className={styles.item} label="Name" name="name">
          <Space className={styles.space}>
            <Form.Item name="name" noStyle>
              <Input placeholder="Edit name" disabled={disabledInputs} allowClear />
            </Form.Item>
            <span className={styles.extension}>{ext}</span>
          </Space>
        </Form.Item>
        <Form.Item className={styles.item} label="OriginalDate" name="originalDate">
          <DatePicker
            format={dateFormat}
            className={styles.itemWidth}
            placeholder="Edit date"
            disabled={disabledInputs}
          />
        </Form.Item>
        <Form.Item className={styles.item} label="Keywords" name="keywords">
          <Select className={styles.keywords} mode="tags" placeholder="Edit keywords" disabled={disabledInputs}>
            {allKeywords &&
              allKeywords.map(keyword => (
                <Option key={keyword} value={keyword}>
                  {keyword}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item className={styles.item} {...tailLayout}>
          <Space>
            <Form.Item>
              <Button style={{ marginRight: 10 }} type="primary" htmlType="submit" disabled={disabledInputs}>
                Edit
              </Button>
              {isEditMany ? (
                <Button onClick={handleSelectAll} type="primary" loading={isExifLoading}>
                  {isSelectAllBtn ? 'Select all' : 'Unselect all'}
                </Button>
              ) : (
                ''
              )}
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
      {contextHolder}
    </div>
  )
}

export default EditMenu
