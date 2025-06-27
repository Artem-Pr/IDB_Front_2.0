import { useState, useCallback, useMemo } from 'react'

import debounce from 'debounce'

interface UseAutocompleteDataProps<T> {
  searchFunction: (searchValue: string, page: number, perPage: number) => Promise<{ data: { items: T[], hasMore: boolean } }>
  pageSize?: number
  debounceDelay?: number
}

interface UseAutocompleteDataReturn {
  options: { value: string }[]
  loading: boolean
  hasMore: boolean
  handleSearch: (searchValue: string) => void
  handlePopupScroll: (e: React.UIEvent<HTMLElement, UIEvent>) => void
  handleFocus: () => void
}

export const useAutocompleteData = <T extends { name?: string; value?: string }>({
  searchFunction,
  pageSize = 50,
  debounceDelay = 500
}: UseAutocompleteDataProps<T>): UseAutocompleteDataReturn => {
  const [options, setOptions] = useState<{ value: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [currentSearchValue, setCurrentSearchValue] = useState('')

  const performSearch = useCallback((searchValue: string) => {
    setPage(1)
    setHasMore(true)
    setLoading(true)
    setOptions([])
    setCurrentSearchValue(searchValue)
    
    searchFunction(searchValue, 1, pageSize)
      .then(res => {
        const items = res.data.items || []
        const mappedOptions = items.map(item => ({ 
          value: (item as any).name || (item as any).value || String(item)
        }))
        setOptions(mappedOptions)
        setHasMore(res.data.hasMore)
      })
      .catch(() => {
        setOptions([])
        setHasMore(false)
      })
      .finally(() => setLoading(false))
  }, [searchFunction, pageSize])

  const debouncedSearch = useMemo(
    () => debounce((searchValue: string) => {
      performSearch(searchValue)
    }, debounceDelay),
    [performSearch, debounceDelay],
  )

  const handleSearch = useCallback(
    (searchValue: string) => {
      debouncedSearch(searchValue)
    },
    [debouncedSearch],
  )

  const handlePopupScroll = useCallback((e: React.UIEvent<HTMLElement, UIEvent>) => {
    const { target } = e
    const scrollElement = target as HTMLElement
    const { scrollTop, scrollHeight, clientHeight } = scrollElement
    
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      setLoading(true)
      searchFunction(currentSearchValue, page + 1, pageSize)
        .then(res => {
          const items = res.data.items || []
          const mappedOptions = items.map(item => ({ 
            value: (item as any).name || (item as any).value || String(item)
          }))
          setOptions(prev => {
            const prevValues = new Set(prev?.map(opt => opt.value))
            const newOptions = mappedOptions.filter(item => !prevValues.has(item.value))
            return prev ? [...prev, ...newOptions] : newOptions
          })
          setHasMore(res.data.hasMore)
          setPage(prev => prev + 1)
        })
        .catch(() => {
          // Handle error silently
        })
        .finally(() => setLoading(false))
    }
  }, [searchFunction, currentSearchValue, page, pageSize, loading, hasMore])

  const handleFocus = useCallback(() => {
    if (options.length === 0 && !loading) {
      performSearch('')
    }
  }, [options, loading, performSearch])

  return {
    options,
    loading,
    hasMore,
    handleSearch,
    handlePopupScroll,
    handleFocus,
  }
} 