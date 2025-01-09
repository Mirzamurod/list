import { ReactNode } from 'react'
import { StyleProps, TableCellProps } from '@chakra-ui/react'

export type TTable = {
  data: any[]
  columns: TColumns[]
  loading?: boolean
  pageCount?: number
  footerPagination?: boolean
  pageSizeOptions?: number[]
  sortModel?: TSortModel | null
  onSortModelChange?: (value: TSortModel | null) => void
  paginationModel?: { page: number; pageSize: number }
  onPaginationModelChange?: (value: { page: number; pageSize: number }) => void
}

export type TColumns = {
  field: string
  headerName: string
  sortable?: boolean
  renderCell?: ({ row }: { row: any; [x: string]: any }) => ReactNode
} & StyleProps &
  TableCellProps

export type TSortModel = { field: string; sort: 'asc' | 'desc' }
