// src/tasks/DeleteTask.jsx
import React from "react";
import { deleteTask } from "./taskService";

export default function DeleteTask({ taskId, onClose, onDeleted }) {
  const handleDelete = async () => {
    await deleteTask(taskId);
    onDeleted(taskId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <p className="mb-4">Are you sure you want to delete this task?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}
