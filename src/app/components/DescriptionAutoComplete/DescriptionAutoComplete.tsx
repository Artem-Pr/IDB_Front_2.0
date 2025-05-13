import React, { useState, useCallback, useMemo } from 'react'

import { AutoComplete, Input } from 'antd'
import debounce from 'debounce'

import { mainApi } from 'src/api/api'
import { warningMessage } from 'src/app/common/notifications'

const { TextArea } = Input

const PAGE_SIZE = 50
const DEBOUNCE_DELAY = 500

interface DescriptionAutoCompleteProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  textAreaClassName?: string
  disabled?: boolean
  showCount?: boolean
}

const DescriptionAutoComplete: React.FC<DescriptionAutoCompleteProps> = ({
  value,
  onChange,
  placeholder,
  className,
  textAreaClassName,
  disabled,
  showCount,
}) => {
  const [options, setOptions] = useState<{ value: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const performSearch = useCallback((searchValue: string) => {
    setPage(1)
    setHasMore(true)
    setLoading(true)
    setOptions([])
    mainApi.getFilesDescription({
      descriptionPart: searchValue,
      page: 1,
      perPage: PAGE_SIZE,
    })
      .then(res => {
        const descriptions = res.data.descriptions || []
        setOptions(descriptions.map(item => ({ value: item })))
        setHasMore(descriptions.length === PAGE_SIZE)
      })
      .catch(error => {
        warningMessage(error, 'Failed to load descriptions')
        setOptions([])
      })
      .finally(() => setLoading(false))
  }, [])

  const debouncedSearch = useMemo(
    () => debounce((searchValue: string) => {
      performSearch(searchValue)
    }, DEBOUNCE_DELAY),
    [performSearch],
  )

  const handleSearch = useCallback(
    (searchValue: string) => {
      debouncedSearch(searchValue)
    },
    [debouncedSearch],
  )

  const handlePopupScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    const { target } = e
    const scrollElement = target as HTMLElement
    const { scrollTop, scrollHeight, clientHeight } = scrollElement
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      setLoading(true)
      mainApi.getFilesDescription({
        descriptionPart: value || '',
        page: page + 1,
        perPage: PAGE_SIZE,
      })
        .then(res => {
          const descriptions = res.data.descriptions || []
          setOptions(prev => {
            const prevValues = new Set(prev?.map(opt => opt.value))
            const newOptions = descriptions
              .filter(item => !prevValues.has(item))
              .map(item => ({ value: item }))
            return prev ? [...prev, ...newOptions] : newOptions
          })
          setHasMore(descriptions.length === PAGE_SIZE)
          setPage(prev => prev + 1)
        })
        .catch(error => {
          warningMessage(error, 'Failed to load more descriptions')
        })
        .finally(() => setLoading(false))
    }
  }

  return (
    <AutoComplete
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
      style={{ height: '100%', width: '100%' }}
      options={options}
      onSearch={handleSearch}
      onPopupScroll={handlePopupScroll}
      notFoundContent={loading ? 'Loading...' : 'No results'}
      maxLength={2000}
    >
      <TextArea
        className={textAreaClassName}
        placeholder={placeholder}
        showCount={showCount}
      />
    </AutoComplete>
  )
}

export default DescriptionAutoComplete
