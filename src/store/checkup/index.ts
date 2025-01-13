import { createSlice } from '@reduxjs/toolkit'
import { list, checkupapi } from '@/store/apis'
import { TCheckupEditForm, TCheckupForm, TCheckupState } from '@/types/checkup'

const initialState: TCheckupState = {
  isLoading: false,
  checkups: [],
  checkup: null,
  pageCount: 0,
  errors: null,
  success: false,
}

const checkup = createSlice({
  name: 'checkup',
  initialState,
  reducers: {
    // get checkups
    onStartGetCheckups: state => {
      state.isLoading = true
      state.success = false
      state.errors = null
      state.checkup = null
    },
    onSuccessGetCheckups: (state, { payload }) => {
      state.checkups = payload.data
      state.pageCount = payload.pageLists
      state.isLoading = false
    },
    onFailGetCheckups: (state, { payload }) => {
      state.isLoading = false
      state.errors = payload?.messages
      state.success = payload?.success
    },
    // get checkup
    onStartGetCheckup: state => {
      state.isLoading = true
      state.success = false
    },
    onSuccessGetCheckup: (state, { payload }) => {
      state.isLoading = false
      state.checkup = payload.data
    },
    onFailGetCheckup: (state, { payload }) => {
      state.isLoading = false
      state.errors = payload?.messages
      state.success = payload?.success
    },
    // get checkup
    onStartAddEditCheckup: state => {
      state.isLoading = true
      state.success = false
    },
    onSuccessAddEditCheckup: state => {
      state.isLoading = false
      state.success = true
    },
    onFailAddEditCheckup: (state, { payload }) => {
      state.isLoading = false
      state.errors = payload?.messages
      state.success = payload?.success
    },
  },
})

export const getCheckups = (params?: any) =>
  list({
    url: checkupapi,
    method: 'get',
    params,
    onStart: checkup.actions.onStartGetCheckups.type,
    onSuccess: checkup.actions.onSuccessGetCheckups.type,
    onFail: checkup.actions.onFailGetCheckups.type,
  })

export const getCheckup = (id: string) =>
  list({
    url: checkupapi,
    method: 'get',
    params: { id },
    onStart: checkup.actions.onStartGetCheckup.type,
    onSuccess: checkup.actions.onSuccessGetCheckup.type,
    onFail: checkup.actions.onFailGetCheckup.type,
  })

export const addCheckup = (data: TCheckupForm) =>
  list({
    url: checkupapi,
    method: 'post',
    data,
    onStart: checkup.actions.onStartAddEditCheckup.type,
    onSuccess: checkup.actions.onSuccessAddEditCheckup.type,
    onFail: checkup.actions.onFailAddEditCheckup.type,
  })

export const editCheckup = (id: string, data: TCheckupEditForm) =>
  list({
    url: checkupapi,
    method: 'patch',
    data,
    params: { id },
    onStart: checkup.actions.onStartAddEditCheckup.type,
    onSuccess: checkup.actions.onSuccessAddEditCheckup.type,
    onFail: checkup.actions.onFailAddEditCheckup.type,
  })

export const deleteCheckup = (id: string) =>
  list({
    url: checkupapi,
    method: 'delete',
    params: { id },
    onStart: checkup.actions.onStartAddEditCheckup.type,
    onSuccess: checkup.actions.onSuccessAddEditCheckup.type,
    onFail: checkup.actions.onFailAddEditCheckup.type,
  })

export default checkup.reducer
