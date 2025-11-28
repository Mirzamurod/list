import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import {
  Box,
  SimpleGrid,
  Spinner,
  Text,
  useBreakpointValue,
  Flex,
  Select,
} from '@chakra-ui/react'
import TableHeader from '@/view/checkups/TableHeader'
import Table from '@/components/Table'
import { TSortModel } from '@/types/table'
import { useAppSelector } from '@/store'
import columns from '@/view/checkups/columns'
import { getCheckups } from '@/store/checkup'
import { getClient } from '@/store/client'
import CheckupCard from '@/view/checkups/CheckupCard'
import ReactPaginate from 'react-paginate'
import { useTranslation } from 'next-i18next'

const CheckupClient = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [ordering, setOrdering] = useState<TSortModel | null>(null)
  const [search, setSearch] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const debounceTimeout = useRef<NodeJS.Timeout | number | null>(null)

  const { checkups, isLoading, pageCount, success } = useAppSelector(state => state.checkup)
  const showCards = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    dispatch(
      getCheckups({
        page: router.query.page || 1,
        limit: router.query.limit || 10,
        sortName: ordering?.field,
        sortValue: ordering?.sort,
        // search: inputValue,
        clientId: router.query.id,
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
          // search: inputValue,
          clientId: router.query.id,
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
          onChange={({ target }) =>
            onChange({ page: 1, limit: +target.value })
          }
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
          ) : checkups.length === 0 ? (
            <Flex alignItems='center' justifyContent='center' py={10}>
              <Text>{t('no_data')}</Text>
            </Flex>
          ) : (
            <SimpleGrid columns={1} spacing={4}>
              {checkups.map(checkup => (
                <CheckupCard key={checkup._id} checkup={checkup} />
              ))}
            </SimpleGrid>
          )}
          {renderPagination()}
        </>
      ) : (
        <Table
          data={checkups}
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

export default CheckupClient
