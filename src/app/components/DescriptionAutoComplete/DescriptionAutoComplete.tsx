import React, { useCallback } from 'react'

import { mainApi } from 'src/api/requests/api-requests'
import { warningMessage } from 'src/app/common/notifications'
import { AutoCompleteTextArea } from 'src/app/components/UIKit'

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
  const searchFunction = useCallback(
    async (searchValue: string, page: number, perPage: number) => {
      try {
        const response = await mainApi.getFilesDescription({
          descriptionPart: searchValue,
          page,
          perPage,
        })
        
        const descriptions = response.data.descriptions || []
        return {
          data: {
            items: descriptions,
            hasMore: descriptions.length === perPage,
          },
        }
      } catch (error) {
        warningMessage(error as Error, 'Failed to load descriptions')
        return {
          data: {
            items: [],
            hasMore: false,
          },
        }
      }
    },
    []
  )

  return (
    <AutoCompleteTextArea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      textAreaClassName={textAreaClassName}
      disabled={disabled}
      showCount={showCount}
      searchFunction={searchFunction}
      notFoundText="No results"
      pageSize={50}
      debounceDelay={500}
    />
  )
}

export default DescriptionAutoComplete
