<?php

namespace App\Http\Controllers\Api;

use App\Models\Board;
use App\Models\Column;
use Illuminate\Http\Request;

class ColumnController
{
    public function store(Request $request, Board $board)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $position = $board->columns()->max('position') + 1;

        $column = $board->columns()->create([
            'name' => $validated['name'],
            'position' => $position,
        ]);

        return response()->json($column, 201);
    }

    public function update(Request $request, Board $board, Column $column)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $column->update($validated);

        return response()->json($column);
    }

    public function destroy(Request $request, Board $board, Column $column)
    {
        $this->authorize('update', $board);

        $column->delete();

        return response()->json(null, 204);
    }
}
