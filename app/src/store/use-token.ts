import { create } from 'zustand'

type State = {
  accessToken: string | null
  setToken: (accessToken: string) => void
  removeToken: () => void
}

export const useToken = create<State>()(set => ({
  accessToken: null,
  setToken: accessToken => {
    set({ accessToken })
  },
  removeToken: () => {
    set({ accessToken: null })
  }
}))
