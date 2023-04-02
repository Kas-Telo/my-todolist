import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  withCredentials: true,
  headers: {
    'api-key': '41d1822b-9d0e-4fbf-9e44-c97716d136e8',
  },
})
