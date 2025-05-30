import React from "react";

export default function TaskGrid({ tasks, title }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="border rounded p-4 shadow-sm">
              <h3 className="font-bold text-lg">{task.taskName}</h3>
              <p className="text-sm text-gray-600 mb-1">{task.category}</p>
              <p className="text-sm mb-2">{task.description}</p>
              <p className="text-xs text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className={`text-xs font-semibold ${
                task.status === "Completed" ? "text-green-600" : "text-yellow-600"
              }`}>
                Status: {task.status}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
