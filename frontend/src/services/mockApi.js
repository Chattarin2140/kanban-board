// Mock API - สำหรับทดสอบโดยไม่ต้อง Backend ที่แท้จริง

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Initial Mock Data
const initMockData = () => {
  if (!localStorage.getItem('mockUsers')) {
    localStorage.setItem('mockUsers', JSON.stringify([
      {
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'hashed_password'
      }
    ]))
  }

  if (!localStorage.getItem('mockBoards')) {
    localStorage.setItem('mockBoards', JSON.stringify([
      {
        id: 1,
        name: 'My First Board',
        owner_id: 1,
        members: [{ id: 1, name: 'Demo User' }],
        created_at: new Date().toISOString()
      }
    ]))
  }

  if (!localStorage.getItem('mockColumns')) {
    localStorage.setItem('mockColumns', JSON.stringify([
      { id: 1, board_id: 1, name: 'To Do', position: 1 },
      { id: 2, board_id: 1, name: 'In Progress', position: 2 },
      { id: 3, board_id: 1, name: 'Done', position: 3 }
    ]))
  }

  if (!localStorage.getItem('mockTasks')) {
    localStorage.setItem('mockTasks', JSON.stringify([
      {
        id: 1,
        column_id: 1,
        title: 'Setup project',
        description: 'Initialize the project structure',
        position: 1,
        assignees: []
      },
      {
        id: 2,
        column_id: 2,
        title: 'Create components',
        description: '',
        position: 1,
        assignees: []
      },
      {
        id: 3,
        column_id: 3,
        title: 'Deploy',
        description: '',
        position: 1,
        assignees: []
      }
    ]))
  }
}

export const mockApi = {
  // Auth
  register: async (name, email, password) => {
    await delay(500)
    initMockData()

    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]')
    if (users.find(u => u.email === email)) {
      throw { response: { data: { message: 'Email already registered' } } }
    }

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password
    }
    users.push(newUser)
    localStorage.setItem('mockUsers', JSON.stringify(users))

    return {
      user: { id: newUser.id, name, email },
      token: 'mock_token_' + newUser.id
    }
  },

  login: async (email, password) => {
    await delay(500)
    initMockData()

    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]')
    const user = users.find(u => u.email === email)

    if (!user || user.password !== password) {
      throw { response: { data: { message: 'Invalid credentials' } } }
    }

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token: 'mock_token_' + user.id
    }
  },

  logout: async () => {
    await delay(200)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getMe: async () => {
    await delay(200)
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user
  },

  // Boards
  getBoards: async () => {
    await delay(300)
    initMockData()

    const boards = JSON.parse(localStorage.getItem('mockBoards') || '[]')
    return boards
  },

  getBoard: async (id) => {
    await delay(300)
    initMockData()

    const boards = JSON.parse(localStorage.getItem('mockBoards') || '[]')
    const columns = JSON.parse(localStorage.getItem('mockColumns') || '[]')
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]')

    const board = boards.find(b => b.id == id)
    if (!board) throw { response: { data: { message: 'Board not found' } } }

    return {
      ...board,
      columns: columns.filter(c => c.board_id == id).map(col => ({
        ...col,
        tasks: tasks.filter(t => t.column_id === col.id)
      })),
      tasks: tasks.filter(t => 
        columns.find(c => c.board_id == id && c.id === t.column_id)
      )
    }
  },

  createBoard: async (name) => {
    await delay(300)
    initMockData()

    const boards = JSON.parse(localStorage.getItem('mockBoards') || '[]')
    const newBoard = {
      id: Math.max(0, ...boards.map(b => b.id)) + 1,
      name,
      owner_id: 1,
      members: [{ id: 1, name: 'You' }],
      created_at: new Date().toISOString()
    }
    boards.push(newBoard)
    localStorage.setItem('mockBoards', JSON.stringify(boards))

    return newBoard
  },

  updateBoard: async (id, name) => {
    await delay(300)
    const boards = JSON.parse(localStorage.getItem('mockBoards') || '[]')
    const board = boards.find(b => b.id == id)
    if (board) {
      board.name = name
      localStorage.setItem('mockBoards', JSON.stringify(boards))
    }
    return board
  },

  deleteBoard: async (id) => {
    await delay(300)
    let boards = JSON.parse(localStorage.getItem('mockBoards') || '[]')
    let columns = JSON.parse(localStorage.getItem('mockColumns') || '[]')
    let tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]')

    boards = boards.filter(b => b.id != id)
    const colIds = columns.filter(c => c.board_id == id).map(c => c.id)
    columns = columns.filter(c => c.board_id != id)
    tasks = tasks.filter(t => !colIds.includes(t.column_id))

    localStorage.setItem('mockBoards', JSON.stringify(boards))
    localStorage.setItem('mockColumns', JSON.stringify(columns))
    localStorage.setItem('mockTasks', JSON.stringify(tasks))
  },

  // Columns
  createColumn: async (boardId, name) => {
    await delay(300)
    const columns = JSON.parse(localStorage.getItem('mockColumns') || '[]')
    const newColumn = {
      id: Math.max(0, ...columns.map(c => c.id)) + 1,
      board_id: boardId,
      name,
      position: columns.filter(c => c.board_id == boardId).length + 1
    }
    columns.push(newColumn)
    localStorage.setItem('mockColumns', JSON.stringify(columns))
    return newColumn
  },

  updateColumn: async (boardId, columnId, name) => {
    await delay(300)
    const columns = JSON.parse(localStorage.getItem('mockColumns') || '[]')
    const column = columns.find(c => c.id == columnId)
    if (column) {
      column.name = name
      localStorage.setItem('mockColumns', JSON.stringify(columns))
    }
    return column
  },

  deleteColumn: async (boardId, columnId) => {
    await delay(300)
    let columns = JSON.parse(localStorage.getItem('mockColumns') || '[]')
    let tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]')

    columns = columns.filter(c => c.id != columnId)
    tasks = tasks.filter(t => t.column_id != columnId)

    localStorage.setItem('mockColumns', JSON.stringify(columns))
    localStorage.setItem('mockTasks', JSON.stringify(tasks))
  },

  // Tasks
  getTasks: async (boardId) => {
    await delay(300)
    const columns = JSON.parse(localStorage.getItem('mockColumns') || '[]')
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]')
    const colIds = columns.filter(c => c.board_id == boardId).map(c => c.id)
    return tasks.filter(t => colIds.includes(t.column_id))
  },

  createTask: async (boardId, columnId, title) => {
    await delay(300)
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]')
    const newTask = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      column_id: columnId,
      title,
      description: '',
      position: tasks.filter(t => t.column_id == columnId).length + 1,
      assignees: []
    }
    tasks.push(newTask)
    localStorage.setItem('mockTasks', JSON.stringify(tasks))
    return newTask
  },

  updateTask: async (boardId, taskId, updates) => {
    await delay(300)
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]')
    const task = tasks.find(t => t.id == taskId)
    if (task) {
      Object.assign(task, updates)
      localStorage.setItem('mockTasks', JSON.stringify(tasks))
    }
    return task
  },

  deleteTask: async (boardId, taskId) => {
    await delay(300)
    let tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]')
    tasks = tasks.filter(t => t.id != taskId)
    localStorage.setItem('mockTasks', JSON.stringify(tasks))
  },

  reorderTasks: async (boardId, tasksData) => {
    await delay(300)
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]')
    tasksData.forEach(td => {
      const task = tasks.find(t => t.id == td.id)
      if (task) {
        task.position = td.position
        task.column_id = td.column_id
      }
    })
    localStorage.setItem('mockTasks', JSON.stringify(tasks))
    return tasks
  },

  assignMember: async (boardId, taskId, memberId) => {
    await delay(300)
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]')
    const task = tasks.find(t => t.id == taskId)
    if (task && !task.assignees.find(a => a.id === memberId)) {
      task.assignees.push({ id: memberId, name: 'Team Member' })
      localStorage.setItem('mockTasks', JSON.stringify(tasks))
    }
    return task
  },

  inviteMember: async (boardId, email) => {
    await delay(300)
    const boards = JSON.parse(localStorage.getItem('mockBoards') || '[]')
    const board = boards.find(b => b.id == boardId)
    if (board) {
      board.members.push({ id: Math.random(), name: email })
      localStorage.setItem('mockBoards', JSON.stringify(boards))
    }
    return board
  }
}

initMockData()
