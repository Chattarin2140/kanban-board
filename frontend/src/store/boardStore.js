import { create } from 'zustand'

export const useBoardStore = create((set) => ({
  boards: [],
  currentBoard: null,
  setBoards: (boards) => set({ boards }),
  setCurrentBoard: (board) => set({ currentBoard: board }),
  addBoard: (board) => set((state) => ({ 
    boards: [...state.boards, board] 
  })),
  updateBoard: (id, updates) => set((state) => ({
    boards: state.boards.map(b => b.id === id ? { ...b, ...updates } : b)
  })),
  deleteBoard: (id) => set((state) => ({
    boards: state.boards.filter(b => b.id !== id)
  })),
}))
