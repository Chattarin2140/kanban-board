<?php

namespace App\Http\Controllers\Api;

use App\Models\Board;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController
{
    public function index(Request $request, Board $board)
    {
        $this->authorize('view', $board);

        $tasks = $board->tasks()->with('assignees', 'tags')->get();

        return response()->json($tasks);
    }

    public function store(Request $request, Board $board)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'column_id' => 'required|exists:columns,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $column = $board->columns()->findOrFail($validated['column_id']);

        $position = $column->tasks()->max('position') + 1;

        $task = $column->tasks()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'position' => $position,
        ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, Board $board, Task $task)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'column_id' => 'sometimes|exists:columns,id',
            'position' => 'sometimes|integer',
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(Request $request, Board $board, Task $task)
    {
        $this->authorize('update', $board);

        $task->delete();

        return response()->json(null, 204);
    }

    public function assign(Request $request, Board $board, Task $task)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'member_id' => 'required|exists:users,id',
        ]);

        $task->assignees()->attach($validated['member_id']);

        return response()->json($task->load('assignees'));
    }

    public function reorder(Request $request, Board $board)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.position' => 'required|integer',
            'tasks.*.column_id' => 'required|exists:columns,id',
        ]);

        foreach ($validated['tasks'] as $taskData) {
            Task::findOrFail($taskData['id'])->update([
                'position' => $taskData['position'],
                'column_id' => $taskData['column_id'],
            ]);
        }

        return response()->json($board->tasks()->with('assignees')->get());
    }
}
