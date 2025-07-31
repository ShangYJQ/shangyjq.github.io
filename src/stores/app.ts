// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
    isLoggedIn: false,
    bgBlur: 0,
    username: '',
    flower: 0,
  }),
})
