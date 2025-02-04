'use client'

import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useRouter, useSearchParams } from 'next/navigation'
import { TagHeader } from './TagHeader'
import { TagInput } from './TagInput'
import { DefaultTagList } from './DefaultTagList'
import { SearchResults } from './SearchResults'
import { kunFetchGet, kunFetchPost } from '~/utils/kunFetch'
import { useMounted } from '~/hooks/useMounted'
import type { Tag as TagType } from '~/types/api/tag'

interface Props {
  initialTags: TagType[]
  initialTotal: number
}

export const Container = ({ initialTags, initialTotal }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tags, setTags] = useState<TagType[]>(initialTags)
  const [loading, setLoading] = useState(false)
  const isMounted = useMounted()

  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 500)
  const [suggestions, setSuggestions] = useState<TagType[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tagsParam = searchParams.get('tags')
    return tagsParam ? tagsParam.split(',') : []
  })
  const [galgames, setGalgames] = useState<GalgameCard[]>([])

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [total, setTotal] = useState(initialTotal)

  const params = new URLSearchParams()

  const updateSearchParams = (newTags: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','))
    } else {
      params.delete('tags')
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const fetchTags = async (currentPage: number) => {
    setLoading(true)
    const { tags: newTags, total: newTotal } = await kunFetchGet<{
      tags: TagType[]
      total: number
    }>('/tag/all', {
      page: currentPage,
      limit: 100
    })
    setTags(newTags)
    setTotal(newTotal)
    setLoading(false)
  }

  useEffect(() => {
    if (!isMounted) {
      return
    }
    params.set('page', page.toString())
    fetchTags(page)
  }, [page, isMounted])

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      return
    }

    const response = await kunFetchPost<TagType[]>('/tag/search', {
      query: [searchQuery]
    })
    setSuggestions(response)
  }

  const [searching, setSearching] = useState(false)
  const [searchPage, setSearchPage] = useState(
    Number(searchParams.get('page')) || 1
  )
  const [searchTotal, setSearchTotal] = useState(0)

  const fetchGalgamesWithTags = async (currentPage: number) => {
    if (selectedTags.length === 0) {
      setGalgames([])
      return
    }

    setSearching(true)
    const response = await kunFetchPost<{
      galgames: GalgameCard[]
      total: number
    }>('/search/tag', {
      query: selectedTags,
      page: currentPage,
      limit: 24
    })
    setGalgames(response.galgames)
    setSearchTotal(response.total)
    setSearching(false)
  }

  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery)
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery])

  useEffect(() => {
    updateSearchParams(selectedTags)
    if (selectedTags.length > 0) {
      setSearchPage(1)
      fetchGalgamesWithTags(1)
    }
  }, [selectedTags])

  useEffect(() => {
    params.set('page', searchPage.toString())
    if (selectedTags.length > 0) {
      fetchGalgamesWithTags(searchPage)
    }
  }, [searchPage])

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSearch = () => {
    if (!query.trim()) return
    handleTagSelect(query.trim())
    setQuery('')
  }

  return (
    <div className="flex flex-col w-full my-4 space-y-8">
      <TagHeader setNewTag={(newTag) => setTags([newTag, ...tags])} />

      <TagInput
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        suggestions={suggestions}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onTagRemove={(tag) =>
          setSelectedTags(selectedTags.filter((t) => t !== tag))
        }
      />

      {selectedTags.length > 0 ? (
        <SearchResults
          galgames={galgames}
          loading={loading}
          total={searchTotal}
          page={searchPage}
          onPageChange={setSearchPage}
        />
      ) : (
        <DefaultTagList
          tags={tags}
          loading={loading}
          searching={searching}
          total={total}
          page={page}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
