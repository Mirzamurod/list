import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { Box } from '@chakra-ui/react'
import TableHeader from '@/view/checkups/TableHeader'
import Table from '@/components/Table'
import { TSortModel } from '@/types/table'
import { useAppSelector } from '@/store'
import columns from '@/view/checkups/columns'
import { getCheckups } from '@/store/checkup'
import { getClient } from '@/store/client'

const CheckupClient = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [ordering, setOrdering] = useState<TSortModel | null>(null)
  const [search, setSearch] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const debounceTimeout = useRef<NodeJS.Timeout | number | null>(null)

  const { clients, isLoading, pageCount, success } = useAppSelector(state => state.client)

  useEffect(() => {
    dispatch(
      getCheckups({
        page: router.query.page || 1,
        limit: router.query.limit || 10,
        sortName: ordering?.field,
        sortValue: ordering?.sort,
        search: inputValue,
      })
    )
  }, [router.query.page, router.query.limit, ordering, inputValue])

  useEffect(() => {
    if (success)
      dispatch(
        getCheckups({
          page: router.query.page || 1,
          limit: router.query.limit || 10,
          sortName: ordering?.field,
          sortValue: ordering?.sort,
          search: inputValue,
        })
      )
  }, [router.query.page, router.query.limit, ordering, inputValue, success])

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current as number)
    }

    debounceTimeout.current = setTimeout(() => {
      setInputValue(search)
    }, 2000)

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current as number)
    }
  }, [search])

  useEffect(() => {
    dispatch(getClient(router.query.id as string))
  }, [])

  const onChange = (item: { [value: string]: string | string[] | number }) =>
    router.replace({ query: { ...router.query, ...item } }, undefined, { shallow: true })

  return (
    <Box>
      <TableHeader search={search} setSearch={setSearch} />
      <Table
        data={clients}
        columns={columns}
        loading={isLoading}
        pageCount={pageCount}
        sortModel={ordering}
        paginationModel={{
          page: (+router.query.page! || 1) - 1,
          pageSize: +router.query.limit! || 10,
        }}
        onPaginationModelChange={newItem =>
          onChange({ page: newItem.page, limit: newItem.pageSize })
        }
        onSortModelChange={sort => setOrdering(sort)}
      />
    </Box>
  )
}

export default CheckupClient
