import React, { useEffect, useMemo } from 'react'
import { Form, Input, Button, DatePicker, Space } from 'antd'
import moment from 'moment'

import styles from './index.module.scss'
import { UploadingObject } from '../../../redux/types'
import { dateFormat, getNameParts } from '../../common/utils'

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

const EditMenu = ({ uploadingFiles, selectedList }: Props) => {
  const [form] = Form.useForm()
  const { name, originalDate } = useMemo(
    () => (!selectedList.length ? initialFileObject : uploadingFiles[selectedList[selectedList.length - 1]]),
    [uploadingFiles, selectedList]
  )
  const disabledInputs = useMemo(() => !selectedList.length, [selectedList])
  const { shortName, ext } = useMemo(() => getNameParts(name), [name])

  useEffect(() => {
    form.setFieldsValue({
      name: shortName,
      originalDate: originalDate === '-' ? '' : originalDate,
    })
  }, [form, shortName, originalDate])

  const onFinish = (values: any) => {
    console.log({
      name: values.name + ext,
      date: moment(values.originalDate).format(dateFormat),
    })
  }

  return (
    <Form {...layout} form={form} name="basic" onFinish={onFinish}>
      <Form.Item className={styles.item} label="Name" name="name">
        <Space className={styles.space}>
          <Form.Item name="name" noStyle>
            <Input placeholder="Edit name" disabled={disabledInputs} />
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
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditMenu
