// src/tasks/TaskList.jsx
import React, { useState } from "react";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  return (
    <>
      <ul className="divide-y border rounded mt-4">
        {tasks.map(task => (
          <li key={task._id} className="flex justify-between items-center p-2">
            <div>
              <strong>{task.taskName}</strong> - {task.category} - {new Date(task.dueDate).toLocaleDateString()}
              <div className="text-sm text-gray-600">{task.status}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => setEditTask(task)} className="text-blue-600">Edit</button>
              <button onClick={() => setDeleteId(task._id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editTask && (
        <EditTask
          task={editTask}
          onClose={() => setEditTask(null)}
          onTaskUpdated={updated => {
            onTaskUpdated(updated);
            setEditTask(null);
          }}
        />
      )}

      {deleteId && (
        <DeleteTask
          taskId={deleteId}
          onClose={() => setDeleteId(null)}
          onDeleted={id => {
            onTaskDeleted(id);
            setDeleteId(null);
          }}
        />
      )}
    </>
  );
}
