export default function BoardList({ boards, onBoardClick, onDeleteBoard }) {
  if (boards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No boards yet. Create one to get started!</p>
      </div>
    )
  }

  const handleDelete = (e, boardId) => {
    e.stopPropagation()
    if (window.confirm('Delete this board?')) {
      onDeleteBoard(boardId)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board) => (
        <div
          key={board.id}
          className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 relative"
        >
          <button
            onClick={() => onBoardClick(board)}
            className="w-full text-left hover:bg-gray-50 p-4 -m-4 rounded transition"
          >
            <h3 className="text-xl font-semibold text-gray-900">{board.name}</h3>
            <p className="text-gray-500 text-sm mt-2">
              {board.members?.length || 0} members
            </p>
          </button>
          <button
            onClick={(e) => handleDelete(e, board.id)}
            className="absolute top-4 right-4 bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-sm transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
