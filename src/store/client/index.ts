import { createSlice } from '@reduxjs/toolkit'
import { list, clients } from '@/store/apis'
import { TClientEditForm, TClientForm, TClientState } from '@/types/client'

const initialState: TClientState = {
  isLoading: false,
  clients: [],
  client: null,
  pageCount: 0,
  errors: null,
  success: false,
}

const client = createSlice({
  name: 'client',
  initialState,
  reducers: {
    // get clients
    onStartGetClients: state => {
      state.isLoading = true
      state.success = false
      state.errors = null
      state.client = null
    },
    onSuccessGetClients: (state, { payload }) => {
      state.clients = payload.data
      state.pageCount = payload.pageLists
      state.isLoading = false
    },
    onFailGetClients: (state, { payload }) => {
      state.isLoading = false
      state.errors = payload?.messages
      state.success = payload?.success
    },
    // get client
    onStartGetClient: state => {
      state.isLoading = true
      state.success = false
    },
    onSuccessGetClient: (state, { payload }) => {
      state.isLoading = false
      state.client = payload.data
    },
    onFailGetClient: (state, { payload }) => {
      state.isLoading = false
      state.errors = payload?.messages
      state.success = payload?.success
    },
    // get client
    onStartAddEditClient: state => {
      state.isLoading = true
      state.success = false
    },
    onSuccessAddEditClient: state => {
      state.isLoading = false
      state.success = true
    },
    onFailAddEditClient: (state, { payload }) => {
      state.isLoading = false
      state.errors = payload?.messages
      state.success = payload?.success
    },
  },
})

export const getClients = (params?: any) =>
  list({
    url: clients,
    method: 'get',
    params,
    onStart: client.actions.onStartGetClients.type,
    onSuccess: client.actions.onSuccessGetClients.type,
    onFail: client.actions.onFailGetClients.type,
  })

export const getClient = (id: string) =>
  list({
    url: clients,
    method: 'get',
    params: { id },
    onStart: client.actions.onStartGetClient.type,
    onSuccess: client.actions.onSuccessGetClient.type,
    onFail: client.actions.onFailGetClient.type,
  })

export const addClient = (data: TClientForm) =>
  list({
    url: clients,
    method: 'post',
    data,
    onStart: client.actions.onStartAddEditClient.type,
    onSuccess: client.actions.onSuccessAddEditClient.type,
    onFail: client.actions.onFailAddEditClient.type,
  })

export const editClient = (id: string, data: TClientEditForm) =>
  list({
    url: clients,
    method: 'patch',
    data,
    params: { id },
    onStart: client.actions.onStartAddEditClient.type,
    onSuccess: client.actions.onSuccessAddEditClient.type,
    onFail: client.actions.onFailAddEditClient.type,
  })

export const deleteClient = (id: string) =>
  list({
    url: clients,
    method: 'delete',
    params: { id },
    onStart: client.actions.onStartAddEditClient.type,
    onSuccess: client.actions.onSuccessAddEditClient.type,
    onFail: client.actions.onFailAddEditClient.type,
  })

export default client.reducer
