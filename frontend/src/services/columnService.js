import api from './api'

export const columnService = {
  createColumn: async (boardId, name) => {
    const { data } = await api.post(`/boards/${boardId}/columns`, { name })
    return data
  },

  updateColumn: async (boardId, columnId, name) => {
    const { data } = await api.put(
      `/boards/${boardId}/columns/${columnId}`,
      { name }
    )
    return data
  },

  deleteColumn: async (boardId, columnId) => {
    await api.delete(`/boards/${boardId}/columns/${columnId}`)
  },
}
