import api from './api'

export const boardService = {
  getBoards: async () => {
    const { data } = await api.get('/boards')
    return data
  },

  getBoard: async (id) => {
    const { data } = await api.get(`/boards/${id}`)
    return data
  },

  createBoard: async (name) => {
    const { data } = await api.post('/boards', { name })
    return data
  },

  updateBoard: async (id, name) => {
    const { data } = await api.put(`/boards/${id}`, { name })
    return data
  },

  deleteBoard: async (id) => {
    await api.delete(`/boards/${id}`)
  },

  inviteMember: async (boardId, email) => {
    const { data } = await api.post(`/boards/${boardId}/invite`, { email })
    return data
  },

  getMembers: async (boardId) => {
    const { data } = await api.get(`/boards/${boardId}/members`)
    return data
  },
}
