import React from 'react'

import { AutoComplete, Input } from 'antd'

import { useAutocompleteData } from 'src/app/common/hooks'

const { TextArea } = Input

interface AutoCompleteTextAreaProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  textAreaClassName?: string
  disabled?: boolean
  showCount?: boolean
  maxLength?: number
  searchFunction: (
    searchValue: string, 
    page: number, 
    perPage: number
  ) => Promise<{ data: { items: any[], hasMore: boolean } }>
  notFoundText?: string
  pageSize?: number
  debounceDelay?: number
}

export const AutoCompleteTextArea: React.FC<AutoCompleteTextAreaProps> = ({
  value,
  onChange,
  placeholder,
  className,
  textAreaClassName,
  disabled,
  showCount,
  maxLength = 2000,
  searchFunction,
  notFoundText = 'No results',
  pageSize = 50,
  debounceDelay = 500,
}) => {
  const { options, loading, handleSearch, handlePopupScroll, handleFocus } = useAutocompleteData({
    searchFunction,
    pageSize,
    debounceDelay,
  })

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
      onFocus={handleFocus}
      notFoundContent={loading ? 'Loading...' : notFoundText}
      maxLength={maxLength}
    >
      <TextArea
        className={textAreaClassName}
        placeholder={placeholder}
        showCount={showCount}
      />
    </AutoComplete>
  )
} 