import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  withCredentials: true,
  headers: {
    'api-key': '81900730-749c-4a2a-ba22-e77b5f16bf0e',
  },
})