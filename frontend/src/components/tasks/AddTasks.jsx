import React, { useState, useEffect } from "react";

export default function AddTask({ onClose, onTaskAdded }) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [taskCompletedDate, setTaskCompletedDate] = useState("");
  const [error, setError] = useState("");

  // If user picks a completed date, force status = Completed
  useEffect(() => {
    if (taskCompletedDate) {
      setStatus("Completed");
    }
  }, [taskCompletedDate]);

  // If user changes status to Pending, clear completed date
  useEffect(() => {
    if (status === "Pending") {
      setTaskCompletedDate("");
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!taskName || !category || !dueDate) {
      setError("Task name, category, and due date are required");
      return;
    }

    // Completed status requires completed date
    if (status === "Completed" && !taskCompletedDate) {
      setError("Please provide a completed date if status is Completed");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskName,
          description,
          category,
          dueDate,
          status,
          taskCompletedDate: taskCompletedDate || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create task");
      }

      const newTask = await res.json();
      onTaskAdded(newTask); // notify parent to refresh list
      onClose(); // close form
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Task Name"
          className="border p-2 mb-3 w-full"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-2 mb-3 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <input
          type="text"
          placeholder="Category"
          className="border p-2 mb-3 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <label className="block font-semibold mb-1">Due Date</label>
        <input
          type="date"
          className="border p-2 mb-3 w-full"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        {/* Status dropdown */}
        <label className="block font-semibold mb-1">Status</label>
        <select
          className="border p-2 mb-3 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Completed Date input - show only if status is Completed */}
        {status === "Completed" && (
          <>
            <label className="block font-semibold mb-1">Completed Date</label>
            <input
              type="date"
              className="border p-2 mb-4 w-full"
              value={taskCompletedDate}
              onChange={(e) => setTaskCompletedDate(e.target.value)}
              required={status === "Completed"}
              min={dueDate || undefined}
              max={new Date().toISOString().slice(0, 10)}
            />
          </>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}
