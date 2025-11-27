import type { ReactNode } from 'react'
import type { StyleProps, TableCellProps } from '@chakra-ui/react'

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
  virtualize?: boolean
  virtualizeThreshold?: number
  virtualizeRowHeight?: number
  virtualizeMaxHeight?: number
}

export type TColumns = {
  field: string
  headerName: string
  sortable?: boolean
  renderCell?: ({ row }: { row: any; [x: string]: any }) => ReactNode
} & StyleProps &
  TableCellProps

export type TSortModel = { field: string; sort: 'asc' | 'desc' }
