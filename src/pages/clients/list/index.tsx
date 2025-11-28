import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { Box, SimpleGrid, Spinner, Text, useBreakpointValue } from '@chakra-ui/react'
import TableHeader from '@/view/clients/TableHeader'
import Table from '@/components/Table'
import { TSortModel } from '@/types/table'
import { useAppSelector } from '@/store'
import columns from '@/view/clients/columns'
import { getClients } from '@/store/client'
import ClientCard from '@/view/clients/ClientCard'
import ReactPaginate from 'react-paginate'
import { useTranslation } from 'next-i18next'
import { Flex, Select } from '@chakra-ui/react'

const Clients = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [ordering, setOrdering] = useState<TSortModel | null>(null)
  const [search, setSearch] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const debounceTimeout = useRef<NodeJS.Timeout | number | null>(null)

  const { clients, isLoading, pageCount, success } = useAppSelector(state => state.client)
  const showCards = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    dispatch(
      getClients({
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
        getClients({
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

  const onChange = (item: { [value: string]: string | string[] | number }) =>
    router.replace({ query: { ...router.query, ...item } }, undefined, { shallow: true })

  const paginationModel = {
    page: (+router.query.page! || 1) - 1,
    pageSize: +router.query.limit! || 10,
  }

  const renderPagination = () => {
    if (isLoading || !pageCount) return null

    return (
      <Flex mt={6} alignItems='center' justifyContent='end' flexWrap='wrap' gap={4}>
        <Select
          variant='outline'
          width='auto'
          value={paginationModel.pageSize}
          onChange={({ target }) => onChange({ page: 1, limit: +target.value })}
        >
          {[10, 20, 50].map(item => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </Select>
        <ReactPaginate
          nextLabel='>'
          breakLabel='...'
          previousLabel='<'
          pageRangeDisplayed={3}
          activeClassName='active'
          marginPagesDisplayed={2}
          pageCount={pageCount ?? 1}
          renderOnZeroPageCount={null}
          containerClassName='pagination'
          initialPage={paginationModel.page}
          onPageChange={({ selected }) =>
            onChange({
              page: selected! + 1,
              limit: paginationModel.pageSize,
            })
          }
        />
      </Flex>
    )
  }

  return (
    <Box>
      <TableHeader search={search} setSearch={setSearch} />
      {showCards ? (
        <>
          {isLoading ? (
            <Flex alignItems='center' justifyContent='center' py={10}>
              <Spinner />
              <Text ml={3}>{t('loading')}...</Text>
            </Flex>
          ) : clients.length === 0 ? (
            <Flex alignItems='center' justifyContent='center' py={10}>
              <Text>{t('no_data')}</Text>
            </Flex>
          ) : (
            <SimpleGrid columns={1} spacing={4}>
              {clients.map(client => (
                <ClientCard key={client._id} client={client} />
              ))}
            </SimpleGrid>
          )}
          {renderPagination()}
        </>
      ) : (
        <Table
          data={clients}
          columns={columns}
          loading={isLoading}
          pageCount={pageCount}
          sortModel={ordering}
          paginationModel={paginationModel}
          onPaginationModelChange={newItem =>
            onChange({ page: newItem.page, limit: newItem.pageSize })
          }
          onSortModelChange={sort => setOrdering(sort)}
        />
      )}
    </Box>
  )
}

export default Clients
