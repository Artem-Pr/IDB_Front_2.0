import React, { useEffect, useMemo } from 'react'
import { Form, Input, Button, DatePicker, Space, Modal } from 'antd'
import moment from 'moment'
import { curry, isEmpty } from 'ramda'

import styles from './index.module.scss'
import { UploadingObject } from '../../../redux/types'
import { dateFormat, getLastItem, getNameParts, removeEmptyFields } from '../../common/utils'
import { useEditFilesArr } from '../../common/hooks'

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

const initialFileObject = {
  name: '-',
  originalDate: '',
}

interface Props {
  uploadingFiles: UploadingObject[]
  selectedList: number[]
  isEditMany?: boolean
}

const config = {
  title: 'Duplicate names',
  content: 'Please enter another name',
}

const EditMenu = ({ uploadingFiles, selectedList, isEditMany }: Props) => {
  const [form] = Form.useForm()
  const [modal, contextHolder] = Modal.useModal()
  const editUploadingFiles = useEditFilesArr(selectedList, uploadingFiles)
  const { name, originalDate } = useMemo(
    () => (!selectedList.length ? initialFileObject : uploadingFiles[getLastItem(selectedList)]),
    [uploadingFiles, selectedList]
  )
  const disabledInputs = useMemo(() => !selectedList.length, [selectedList])
  const { shortName, ext } = useMemo(() => getNameParts(name), [name])

  useEffect(() => {
    form.setFieldsValue({
      name: shortName,
      originalDate: originalDate === '-' ? '' : moment(originalDate, dateFormat),
    })
  }, [form, shortName, originalDate])

  const onFinish = ({ name, originalDate }: any) => {
    const isDuplicateName = curry((filesArr: UploadingObject[], currentName: string) => {
      const fileArrNames = filesArr.map(({ name }) => name)
      return fileArrNames.includes(currentName)
    })(uploadingFiles)

    const updateValues = () => {
      const preparedValue = {
        name: name ? name + ext : '',
        originalDate: originalDate ? moment(originalDate).format(dateFormat) : null,
      }
      const editedFields = removeEmptyFields(preparedValue)
      !isEmpty(editedFields) && editUploadingFiles(editedFields)
    }

    const needModalIsDuplicate = !isEditMany && isDuplicateName(name + ext)

    needModalIsDuplicate ? modal.warning(config) : updateValues()
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
        <Form.Item className={styles.item} {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={disabledInputs}>
            Edit
          </Button>
        </Form.Item>
      </Form>
      {contextHolder}
    </div>
  )
}

export default EditMenu
