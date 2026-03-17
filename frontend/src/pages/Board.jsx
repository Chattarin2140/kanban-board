import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { boardService } from '../services/boardService'
import { taskService } from '../services/taskService'
import { columnService } from '../services/columnService'
import { tagService } from '../services/tagService'
import { notificationService } from '../services/notificationService'
import NotificationPanel from '../components/NotificationPanel'

export default function Board() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [board, setBoard] = useState(null)
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [tags, setTags] = useState([])
  const [newColumnName, setNewColumnName] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Task form states
  const [showTaskForm, setShowTaskForm] = useState(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  
  // Invite form states
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState('')
  
  // Assign member states
  const [assigningTaskId, setAssigningTaskId] = useState(null)
  
  // Tag form states
  const [showTagForm, setShowTagForm] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3B82F6')
  const [selectedTaskForTag, setSelectedTaskForTag] = useState(null)
  
  // Notification states
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadBoard()
    loadUnreadCount()
    const interval = setInterval(loadUnreadCount, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [id])

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const loadBoard = async () => {
    try {
      const boardData = await boardService.getBoard(id)
      setBoard(boardData)
      setColumns(boardData.columns || [])
      setTasks(boardData.tasks || [])
      
      const membersData = await boardService.getMembers(id)
      setMembers(membersData)

      const tagsData = await tagService.getTags(id)
      setTags(tagsData)
    } catch (error) {
      console.error('Failed to load board:', error)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateColumn = async (e) => {
    e.preventDefault()
    if (!newColumnName.trim()) return

    try {
      const newColumn = await columnService.createColumn(id, newColumnName)
      setColumns([...columns, newColumn])
      setNewColumnName('')
    } catch (error) {
      console.error('Failed to create column:', error)
    }
  }

  const handleDeleteColumn = async (columnId) => {
    if (!window.confirm('Delete this column and all tasks in it?')) return

    try {
      await columnService.deleteColumn(id, columnId)
      setColumns(columns.filter((c) => c.id !== columnId))
      setTasks(tasks.filter((t) => t.column_id !== columnId))
    } catch (error) {
      console.error('Failed to delete column:', error)
      alert('Failed to delete column')
    }
  }

  const handleCreateTask = async (e, columnId) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    try {
      const newTask = await taskService.createTask(id, columnId, newTaskTitle)
      setTasks([...tasks, { ...newTask, assignees: [] }])
      setNewTaskTitle('')
      setNewTaskDescription('')
      setShowTaskForm(null)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleUpdateTask = async (taskId) => {
    try {
      const updated = await taskService.updateTask(id, taskId, {
        title: editingTask.title,
        description: editingTask.description,
      })
      setTasks(tasks.map((t) => (t.id === taskId ? { ...updated, assignees: t.assignees } : t)))
      setEditingTask(null)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return

    try {
      await taskService.deleteTask(id, taskId)
      setTasks(tasks.filter((t) => t.id !== taskId))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleAssignMember = async (taskId, memberId) => {
    try {
      await taskService.assignMember(id, taskId, memberId)
      const member = members.find((m) => m.id === memberId)
      setTasks(
        tasks.map((t) =>
          t.id === taskId
            ? { ...t, assignees: [...(t.assignees || []), member] }
            : t
        )
      )
      setAssigningTaskId(null)
      // Reload unread count
      loadUnreadCount()
    } catch (error) {
      console.error('Failed to assign member:', error)
    }
  }

  const handleUnassignMember = async (taskId, memberId) => {
    try {
      await taskService.unassignMember(id, taskId, memberId)
      setTasks(
        tasks.map((t) =>
          t.id === taskId
            ? { ...t, assignees: (t.assignees || []).filter((a) => a.id !== memberId) }
            : t
        )
      )
    } catch (error) {
      console.error('Failed to unassign member:', error)
    }
  }

  const handleInviteMember = async (e) => {
    e.preventDefault()
    setInviteError('')

    try {
      await boardService.inviteMember(id, inviteEmail)
      setInviteEmail('')
      setShowInviteForm(false)
      // Reload members
      const membersData = await boardService.getMembers(id)
      setMembers(membersData)
      alert('Member invited successfully!')
    } catch (error) {
      setInviteError(error.response?.data?.message || 'Failed to invite member')
    }
  }

  const handleCreateTag = async (e) => {
    e.preventDefault()
    if (!newTagName.trim()) return

    try {
      const newTag = await tagService.createTag(id, newTagName, newTagColor)
      setTags([...tags, newTag])
      setNewTagName('')
      setNewTagColor('#3B82F6')
      setShowTagForm(false)
    } catch (error) {
      console.error('Failed to create tag:', error)
      alert(error.response?.data?.message || 'Failed to create tag')
    }
  }

  const handleDeleteTag = async (tagId) => {
    if (!window.confirm('Delete this tag?')) return

    try {
      await tagService.deleteTag(id, tagId)
      setTags(tags.filter((t) => t.id !== tagId))
    } catch (error) {
      console.error('Failed to delete tag:', error)
    }
  }

  const handleAssignTag = async (taskId, tagId) => {
    try {
      await tagService.assignTag(id, taskId, tagId)
      setTasks(
        tasks.map((t) => {
          if (t.id === taskId) {
            const tag = tags.find((tg) => tg.id === tagId)
            return { ...t, tags: [...(t.tags || []), tag] }
          }
          return t
        })
      )
      setSelectedTaskForTag(null)
    } catch (error) {
      console.error('Failed to assign tag:', error)
    }
  }

  const handleRemoveTag = async (taskId, tagId) => {
    try {
      await tagService.removeTag(id, taskId, tagId)
      setTasks(
        tasks.map((t) =>
          t.id === taskId
            ? { ...t, tags: (t.tags || []).filter((tg) => tg.id !== tagId) }
            : t
        )
      )
    } catch (error) {
      console.error('Failed to remove tag:', error)
    }
  }

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result

    // draggableId should be a string (column.id might be UUID or number)
    console.log('Dragging:', { draggableId, sourceId: source.droppableId, destId: destination.droppableId })
    
    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // Don't convert - keep as strings since they come from the database as strings/UUIDs
    const taskId = draggableId
    const sourceColumnId = source.droppableId
    const destColumnId = destination.droppableId

    // Create a copy of tasks to modify
    let updatedTasks = JSON.parse(JSON.stringify(tasks))
    console.log('All tasks before:', updatedTasks)

    // Find dragged task
    const draggedTask = updatedTasks.find((t) => t.id === taskId)
    console.log('Dragged task:', draggedTask)
    
    if (!draggedTask) {
      console.error('Task not found:', taskId)
      return
    }

    // Get all tasks in source and destination columns
    const sourceTasks = updatedTasks
      .filter((t) => t.column_id === sourceColumnId)
      .sort((a, b) => (a.position || 0) - (b.position || 0))
    const destTasks = updatedTasks
      .filter((t) => t.column_id === destColumnId && t.id !== taskId)
      .sort((a, b) => (a.position || 0) - (b.position || 0))

    console.log('Source tasks:', sourceTasks)
    console.log('Dest tasks:', destTasks)

    // Remove from source (if reordering)
    const sourceIndex = sourceTasks.findIndex((t) => t.id === taskId)
    if (sourceIndex !== -1) {
      sourceTasks.splice(sourceIndex, 1)
    }

    if (sourceColumnId === destColumnId) {
      // Same column reorder
      sourceTasks.splice(destination.index, 0, draggedTask)
      // Recalculate positions
      updatedTasks = updatedTasks.map((t) => {
        if (t.column_id !== sourceColumnId) return t
        const idx = sourceTasks.findIndex((st) => st.id === t.id)
        return idx >= 0 ? { ...t, position: idx + 1 } : t
      })
    } else {
      // Different column
      // Update source column
      updatedTasks = updatedTasks.map((t) => {
        if (t.column_id !== sourceColumnId) return t
        const idx = sourceTasks.findIndex((st) => st.id === t.id)
        return idx >= 0 ? { ...t, position: idx + 1 } : t
      })

      // Insert into destination
      destTasks.splice(destination.index, 0, draggedTask)

      // Update destination column
      updatedTasks = updatedTasks.map((t) => {
        if (t.column_id !== destColumnId) return t
        if (t.id === taskId) return { ...draggedTask, column_id: destColumnId, position: destination.index + 1 }
        const idx = destTasks.findIndex((dt) => dt.id === t.id)
        return idx >= 0 ? { ...t, position: idx + 1 } : t
      })

      // Add dragged task to updated list
      updatedTasks = updatedTasks.filter((t) => t.id !== taskId)
      updatedTasks.push({ ...draggedTask, column_id: destColumnId, position: destination.index + 1 })
    }

    console.log('Updated tasks:', updatedTasks)
    setTasks(updatedTasks)

    // Send to backend
    const payload = updatedTasks.map((t) => ({
      id: String(t.id),
      column_id: parseInt(t.column_id),
      position: t.position,
    }))
    
    console.log('Reorder payload:', payload)

    try {
      const result = await taskService.reorderTasks(id, payload)
      console.log('Reorder result:', result)
    } catch (error) {
      console.error('Failed to reorder tasks:', error)
      console.error('Error response:', error.response?.data)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-500 hover:text-blue-600 mr-4"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{board?.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-lg"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowInviteForm(!showInviteForm)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Invite Member
              </button>
            </div>
          </div>
        </div>
      </nav>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Invite Form */}
        {showInviteForm && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Invite Member</h3>
            <form onSubmit={handleInviteMember} className="flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter member email..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Send Invite
              </button>
            </form>
            {inviteError && (
              <p className="text-red-500 mt-2">{inviteError}</p>
            )}
          </div>
        )}

        {/* Create Column */}
        <form onSubmit={handleCreateColumn} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="New column name..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Add Column
          </button>
        </form>

        {/* Create Tag */}
        <div className="mb-6">
          {!showTagForm ? (
            <button
              onClick={() => setShowTagForm(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              + Create Tag
            </button>
          ) : (
            <form onSubmit={handleCreateTag} className="bg-white p-4 rounded-lg shadow flex gap-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowTagForm(false)
                  setNewTagName('')
                  setNewTagColor('#3B82F6')
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Display Tags */}
        {tags.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 px-3 py-1 rounded text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  <span className="text-sm">{tag.name}</span>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="hover:text-red-200 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Board Columns */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <Droppable droppableId={String(column.id)} key={column.id}>
                {(provided, snapshot) => (
                  <div
                    key={column.id}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white rounded-lg shadow p-4 ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {column.name}
                      </h2>
                      <button
                        onClick={() => handleDeleteColumn(column.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Tasks in Column */}
                    <div className="space-y-2 mb-4">
                      {tasks
                        .filter((task) => task.column_id === column.id)
                        .sort((a, b) => (a.position || 0) - (b.position || 0))
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-gray-50 p-3 rounded border border-gray-200 hover:shadow-md transition ${
                                  snapshot.isDragging ? 'bg-blue-100 shadow-lg' : ''
                                }`}
                              >
                                {editingTask?.id === task.id ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={editingTask.title}
                                      onChange={(e) =>
                                        setEditingTask({
                                          ...editingTask,
                                          title: e.target.value,
                                        })
                                      }
                                      className="w-full px-2 py-1 border rounded"
                                    />
                                    <textarea
                                      value={editingTask.description || ''}
                                      onChange={(e) =>
                                        setEditingTask({
                                          ...editingTask,
                                          description: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border rounded text-sm"
                            rows="2"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateTask(task.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingTask(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-800 font-medium">{task.title}</p>
                          {task.description && (
                            <p className="text-gray-600 text-sm">{task.description}</p>
                          )}
                          
                          {/* Assignees Section */}
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-1">Assigned to:</p>
                            {task.assignees && task.assignees.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {task.assignees.map((assignee) => (
                                  <span
                                    key={assignee.id}
                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1"
                                  >
                                    {assignee.name}
                                    <button
                                      onClick={() => handleUnassignMember(task.id, assignee.id)}
                                      className="text-blue-600 hover:text-red-600 font-bold"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 mb-2">None</p>
                            )}

                            {/* Assign Member Dropdown */}
                            {assigningTaskId === task.id ? (
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAssignMember(task.id, e.target.value)
                                  }
                                }}
                                className="w-full px-2 py-1 border rounded text-xs"
                                defaultValue=""
                              >
                                <option value="">Add member...</option>
                                {members
                                  .filter((m) => !task.assignees?.some((a) => a.id === m.id))
                                  .map((member) => (
                                    <option key={member.id} value={member.id}>
                                      {member.name}
                                    </option>
                                  ))}
                              </select>
                            ) : (
                              <button
                                onClick={() => setAssigningTaskId(task.id)}
                                className="text-xs text-blue-500 hover:text-blue-600 w-full text-left"
                              >
                                + Assign
                              </button>
                            )}
                          </div>

                          {/* Tags Section */}
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-1">Tags:</p>
                            {task.tags && task.tags.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {task.tags.map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                                    style={{ backgroundColor: tag.color }}
                                  >
                                    {tag.name}
                                    <button
                                      onClick={() => handleRemoveTag(task.id, tag.id)}
                                      className="hover:text-red-200 font-bold"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 mb-2">None</p>
                            )}

                            {/* Add Tag Dropdown */}
                            {selectedTaskForTag === task.id ? (
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAssignTag(task.id, e.target.value)
                                  }
                                }}
                                className="w-full px-2 py-1 border rounded text-xs"
                                defaultValue=""
                              >
                                <option value="">Add tag...</option>
                                {tags
                                  .filter((t) => !task.tags?.some((ta) => ta.id === t.id))
                                  .map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                      {tag.name}
                                    </option>
                                  ))}
                              </select>
                            ) : (
                              <button
                                onClick={() => setSelectedTaskForTag(task.id)}
                                className="text-xs text-purple-500 hover:text-purple-600 w-full text-left"
                              >
                                + Add tag
                              </button>
                            )}
                          </div>

                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => setEditingTask(task)}
                              className="text-blue-500 hover:text-blue-600 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-500 hover:text-red-600 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                            </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>

                    {/* Add Task Form */}
                    {showTaskForm === column.id ? (
                      <form
                        onSubmit={(e) => handleCreateTask(e, column.id)}
                        className="bg-blue-50 p-3 rounded border-2 border-blue-200"
                      >
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title..."
                    className="w-full px-2 py-1 border rounded mb-2 text-sm"
                    autoFocus
                    required
                  />
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task description (optional)..."
                    className="w-full px-2 py-1 border rounded mb-2 text-sm"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Add Task
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTaskForm(null)
                        setNewTaskTitle('')
                        setNewTaskDescription('')
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowTaskForm(column.id)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded text-sm"
                >
                  + Add Task
                </button>
              )}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  )
}
