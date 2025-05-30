// src/tasks/EditTask.jsx
import React, { useState } from "react";
import { updateTask } from "./taskService";

export default function EditTask({ task, onClose, onTaskUpdated }) {
  const [form, setForm] = useState({ ...task });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const updated = await updateTask(task._id, form);
      onTaskUpdated(updated);
      onClose();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
        {error && <p className="text-red-600">{error}</p>}
        <input name="taskName" value={form.taskName} onChange={handleChange} className="border p-2 mb-2 w-full" />
        <textarea name="description" value={form.description} onChange={handleChange} className="border p-2 mb-2 w-full" />
        <input name="category" value={form.category} onChange={handleChange} className="border p-2 mb-2 w-full" />
        <input type="date" name="dueDate" value={form.dueDate?.slice(0, 10)} onChange={handleChange} className="border p-2 mb-2 w-full" />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2 mb-4 w-full">
          <option>Pending</option>
          <option>Completed</option>
        </select>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Update</button>
        </div>
      </form>
    </div>
  );
}
