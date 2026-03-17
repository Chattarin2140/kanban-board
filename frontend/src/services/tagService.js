import api from './api'

export const tagService = {
  getTags: async (boardId) => {
    const { data } = await api.get(`/boards/${boardId}/tags`)
    return data
  },

  createTag: async (boardId, name, color) => {
    const { data } = await api.post(`/boards/${boardId}/tags`, {
      name,
      color,
    })
    return data
  },

  updateTag: async (boardId, tagId, updates) => {
    const { data } = await api.put(`/boards/${boardId}/tags/${tagId}`, updates)
    return data
  },

  deleteTag: async (boardId, tagId) => {
    await api.delete(`/boards/${boardId}/tags/${tagId}`)
  },

  assignTag: async (boardId, taskId, tagId) => {
    const { data } = await api.post(`/boards/${boardId}/tasks/${taskId}/tags/${tagId}`)
    return data
  },

  removeTag: async (boardId, taskId, tagId) => {
    const { data } = await api.delete(`/boards/${boardId}/tasks/${taskId}/tags/${tagId}`)
    return data
  },
}
