import api from './api'

export const notificationService = {
  getNotifications: async () => {
    const { data } = await api.get('/notifications')
    return data
  },

  getUnreadCount: async () => {
    const { data } = await api.get('/notifications/unread')
    return data.unread
  },

  markAsRead: async (notificationId) => {
    await api.put(`/notifications/${notificationId}/read`)
  },

  markAllAsRead: async () => {
    await api.put('/notifications/read-all')
  },
}
