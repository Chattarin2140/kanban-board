import api from './api'

export const taskService = {
  getTasks: async (boardId) => {
    const { data } = await api.get(`/boards/${boardId}/tasks`)
    return data
  },

  createTask: async (boardId, columnId, title) => {
    const { data } = await api.post(`/boards/${boardId}/tasks`, {
      column_id: columnId,
      title,
    })
    return data
  },

  updateTask: async (boardId, taskId, updates) => {
    const { data } = await api.put(`/boards/${boardId}/tasks/${taskId}`, updates)
    return data
  },

  deleteTask: async (boardId, taskId) => {
    await api.delete(`/boards/${boardId}/tasks/${taskId}`)
  },

  reorderTasks: async (boardId, tasks) => {
    const { data } = await api.post(`/boards/${boardId}/tasks/reorder`, {
      tasks,
    })
    return data
  },

  assignMember: async (boardId, taskId, memberId) => {
    const { data } = await api.post(
      `/boards/${boardId}/tasks/${taskId}/assign`,
      { member_id: memberId }
    )
    return data
  },

  unassignMember: async (boardId, taskId, memberId) => {
    await api.delete(`/boards/${boardId}/tasks/${taskId}/assign/${memberId}`)
  },
}
