import { createSlice } from '@reduxjs/toolkit'
import { encode } from 'js-base64'
import { list, users, loginapi } from '@/store/apis'
import { IUserStore } from '@/types/user'

const initialState: IUserStore = {
  isLoading: false,
  user: null,
  token: false,
  errors: null,
  success: false,
}

const login = createSlice({
  name: 'user',
  initialState,
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.token = false
      state.success = false
    },
    onSuccess: (state, { payload }) => {
      localStorage.setItem('list', encode(payload.data.token))
      state.token = true
      state.isLoading = false
      state.success = true
    },
    userProfile: (state, { payload }) => {
      state.isLoading = false
      state.user = payload.data
    },
    userUpdate: (state, { payload }) => {
      state.isLoading = false
    },
    userDelete: (state, { payload }) => {
      state.isLoading = false
    },
    onFail: (state, { payload }) => {
      state.isLoading = false
      state.errors = payload?.messages
      state.success = payload?.success
    },
    getUserData: (state, { payload }) => {
      state.user = payload
    },
    deleteUser: () => {
      localStorage.removeItem('list')
      window.location.reload()
    },
  },
})

export const userLogin = (data: any) =>
  list({
    url: loginapi,
    method: 'post',
    data,
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.onSuccess.type,
    onFail: login.actions.onFail.type,
  })

export const userProfile = () =>
  list({
    url: users,
    method: 'get',
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.userProfile.type,
    onFail: login.actions.onFail.type,
  })

export const userUpdate = (data: any) =>
  list({
    url: users,
    method: 'put',
    data,
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.userUpdate.type,
    onFail: login.actions.onFail.type,
  })

export const userDelete = (data: any) =>
  list({
    url: users,
    method: 'post',
    data,
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.userUpdate.type,
    onFail: login.actions.onFail.type,
  })

export const { getUserData, deleteUser } = login.actions

export default login.reducer
