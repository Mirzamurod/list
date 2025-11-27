import type { FC } from 'react'
import type { ListChildComponentProps } from 'react-window'
import type { TColumns, TTable } from '@/types/table'

import { createElement, useMemo } from 'react'
import ReactPaginate from 'react-paginate'
import { useTranslation } from 'next-i18next'
import {
  TableContainer,
  Table as ChakraTable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Spinner,
  Flex,
  Text,
  Select,
} from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { FixedSizeList as List } from 'react-window'

const Table: FC<TTable> = props => {
  const {
    data,
    columns,
    loading,
    pageCount,
    sortModel,
    paginationModel,
    footerPagination = true,
    onSortModelChange,
    onPaginationModelChange,
    pageSizeOptions = [10, 20, 50],
    virtualize = true,
    virtualizeThreshold = 50,
    virtualizeRowHeight = 56,
    virtualizeMaxHeight = 400,
  } = props
  const { t } = useTranslation()

  const changeSortable = (column: TColumns) => {
    if (column.sortable) !column.renderCell && changeSort(column.field)
  }

  const changeSort = (field: string) => {
    if (!sortModel) onSortModelChange!({ field, sort: 'asc' })
    else {
      if (sortModel.field === field) {
        if (sortModel.sort === 'asc') onSortModelChange!({ field, sort: 'desc' })
        else onSortModelChange!(null)
      } else onSortModelChange!({ field, sort: 'asc' })
    }
  }

  const shouldVirtualize = useMemo(
    () => virtualize && !loading && data.length > virtualizeThreshold,
    [virtualize, loading, data.length, virtualizeThreshold]
  )

  const virtualizationHeight = useMemo(() => {
    const maxItems = Math.min(data.length, Math.ceil(virtualizeMaxHeight / virtualizeRowHeight))
    return Math.max(maxItems * virtualizeRowHeight, virtualizeRowHeight)
  }, [data.length, virtualizeMaxHeight, virtualizeRowHeight])

  const renderCellContent = (row: any, column: TColumns) =>
    column.renderCell ? createElement(column.renderCell as any, { row }) : t(row[column.field])

  const VirtualRow = ({ index, style }: ListChildComponentProps) => {
    const row = data[index]

    return (
      <Flex
        key={row?._id ?? index}
        style={style}
        px={4}
        minH={`${virtualizeRowHeight}px`}
        align='center'
        borderBottomWidth='1px'
        borderColor='gray.100'
        bg='chakra-body-bg'
      >
        {columns.map(column => (
          <Box
            key={`${row?._id ?? index}-${column.field}`}
            flex={column.isNumeric ? '0 0 auto' : 1}
            minW={0}
            pr={4}
            textAlign={column.isNumeric ? 'right' : 'left'}
          >
            {renderCellContent(row, column)}
          </Box>
        ))}
      </Flex>
    )
  }

  const renderVirtualizedBody = () => (
    <Tbody>
      <Tr>
        <Td colSpan={columns.length} p={0}>
          <Box maxH={`${virtualizeMaxHeight}px`} overflow='auto'>
            <List
              height={virtualizationHeight}
              itemCount={data.length}
              itemSize={virtualizeRowHeight}
              width='100%'
            >
              {VirtualRow}
            </List>
          </Box>
        </Td>
      </Tr>
    </Tbody>
  )

  const renderStandardBody = () => (
    <Tbody>
      {data.map(item => (
        <Tr key={item._id}>
          {columns.map(column => (
            <Td {...column} key={column.field}>
              {renderCellContent(item, column)}
            </Td>
          ))}
        </Tr>
      ))}
    </Tbody>
  )

  const shouldShowEmptyState = loading || (!loading && !data.length)

  return (
    <Box>
      <TableContainer>
        <ChakraTable variant='simple'>
          <Thead>
            <Tr>
              {columns.map(column => (
                <Th
                  {...column}
                  key={column.field}
                  onClick={() => changeSortable(column)}
                  _hover={{ cursor: 'pointer' }}
                >
                  {t(column.headerName)}{' '}
                  {sortModel?.field === column.field ? (
                    sortModel.sort === 'asc' ? (
                      <TriangleDownIcon />
                    ) : (
                      <TriangleUpIcon />
                    )
                  ) : null}
                </Th>
              ))}
            </Tr>
          </Thead>
          {shouldShowEmptyState ? (
            <Tbody>
              <Tr>
                <Td colSpan={columns.length}>
                  <Flex alignItems='center' justifyContent='center'>
                    {loading ? (
                      <>
                        <Spinner /> <Text ml={3}>Loading...</Text>
                      </>
                    ) : (
                      <Text>{t('no_data')}</Text>
                    )}
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          ) : shouldVirtualize ? (
            renderVirtualizedBody()
          ) : (
            renderStandardBody()
          )}
        </ChakraTable>
      </TableContainer>

      {footerPagination && !loading ? (
        <Flex mt={6} alignItems='center' justifyContent='end'>
          <Select
            variant='outline'
            width='auto'
            value={paginationModel?.pageSize ?? 10}
            onChange={({ target }) =>
              onPaginationModelChange!({ page: 1, pageSize: +target.value })
            }
          >
            {pageSizeOptions?.map(item => (
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
            pageCount={pageCount! ?? 1}
            renderOnZeroPageCount={null}
            containerClassName='pagination'
            initialPage={paginationModel?.page!}
            onPageChange={({ selected }) =>
              onPaginationModelChange!({
                page: selected! + 1,
                pageSize: paginationModel?.pageSize!,
              })
            }
          />
        </Flex>
      ) : null}
    </Box>
  )
}

export default Table
