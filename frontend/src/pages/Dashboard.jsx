import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useBoardStore } from '../store/boardStore'
import { boardService } from '../services/boardService'
import BoardList from '../components/BoardList'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { boards, setBoards } = useBoardStore()
  const [newBoardName, setNewBoardName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBoards()
  }, [])

  const loadBoards = async () => {
    try {
      const data = await boardService.getBoards()
      setBoards(data)
    } catch (error) {
      console.error('Failed to load boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBoard = async (e) => {
    e.preventDefault()
    if (!newBoardName.trim()) return

    try {
      const newBoard = await boardService.createBoard(newBoardName)
      setBoards([...boards, newBoard])
      setNewBoardName('')
    } catch (error) {
      console.error('Failed to create board:', error)
    }
  }

  const handleDeleteBoard = async (boardId) => {
    try {
      await boardService.deleteBoard(boardId)
      setBoards(boards.filter((b) => b.id !== boardId))
    } catch (error) {
      console.error('Failed to delete board:', error)
      alert('Failed to delete board')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">My Boards</h2>

          <form onSubmit={handleCreateBoard} className="flex gap-2">
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Enter new board name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Create Board
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <BoardList 
            boards={boards} 
            onBoardClick={(board) => navigate(`/board/${board.id}`)}
            onDeleteBoard={handleDeleteBoard}
          />
        )}
      </main>
    </div>
  )
}
