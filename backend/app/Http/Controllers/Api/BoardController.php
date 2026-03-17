<?php

namespace App\Http\Controllers\Api;

use App\Models\Board;
use Illuminate\Http\Request;

class BoardController
{
    public function index(Request $request)
    {
        $boards = $request->user()
            ->boards()
            ->with('columns', 'members')
            ->get();

        return response()->json($boards);
    }

    public function show(Request $request, Board $board)
    {
        $this->authorize('view', $board);

        return response()->json(
            $board->load('columns.tasks.assignees', 'members')
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $board = $request->user()->ownedBoards()->create($validated);

        $board->members()->attach($request->user()->id);

        return response()->json($board, 201);
    }

    public function update(Request $request, Board $board)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $board->update($validated);

        return response()->json($board);
    }

    public function destroy(Request $request, Board $board)
    {
        $this->authorize('delete', $board);

        $board->delete();

        return response()->json(null, 204);
    }

    public function invite(Request $request, Board $board)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'email' => 'required|email|exists:users',
        ]);

        $user = \App\Models\User::where('email', $validated['email'])->first();

        $board->members()->syncWithoutDetaching($user->id);

        return response()->json($board);
    }
}
