import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "chart.js/auto";
import AddTask from "../tasks/AddTasks";
import TaskGrid from "../tasks/TaskGrid";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [completedData, setCompletedData] = useState({ labels: [], data: [] });
  const [showAddTask, setShowAddTask] = useState(false);
  const API_URL = `${import.meta.env.VITE_API_URL}`;


  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allTasks = res.data;
      setTasks(allTasks);

      const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

      const todayDate = new Date();
      const tomorrow = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 1);

      setTodayTasks(
        allTasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return isSameDay(taskDate, todayDate);
        })
      );

      setUpcomingTasks(
        allTasks
          .filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate >= tomorrow;
          })
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      );


      const completedMap = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toISOString().slice(0, 10);
        completedMap[key] = 0;
      }

      allTasks.forEach(task => {
        const date = task.taskCompletedDate?.slice(0, 10);
        if (task.status === "Completed" && completedMap[date] !== undefined) {
          completedMap[date]++;
        }
      });

      setCompletedData({
        labels: Object.keys(completedMap),
        data: Object.values(completedMap),
      });
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const downloadCSV = () => {
    const csv =
      tasks.map(t => `${t.taskName},${t.category},${t.dueDate},${t.status}`).join("\n");
    const blob = new Blob(["Task Name,Category,Due Date,Status\n" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "tasks.csv");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "tasks.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    tasks.forEach((t, i) => {
      doc.text(
        `${t.taskName} | ${t.category} | ${t.dueDate?.slice(0, 10)} | ${t.status}`,
        10,
        10 + i * 10
      );
    });
    doc.save("tasks.pdf");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <TaskGrid tasks={todayTasks} title="Tasks Due Today" />

      <section>
        <h2 className="text-xl font-semibold">Tasks Completed in Last 7 Days</h2>
        <Bar
          data={{
            labels: completedData.labels,
            datasets: [
              {
                label: "Completed Tasks",
                data: completedData.data,
                backgroundColor: "#60A5FA",
              },
            ],
          }}
        />
      </section>

      <TaskGrid tasks={upcomingTasks} title="Upcoming Tasks" />

      {/* <section>
        <h2 className="text-xl font-semibold">Popular Categories</h2>
        <ul className="list-disc pl-5">
          {Object.entries(
            tasks.reduce((acc, task) => {
              acc[task.category] = (acc[task.category] || 0) + 1;
              return acc;
            }, {})
          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([cat, count]) => (
              <li key={cat}>
                {cat} ({count})
              </li>
            ))}
        </ul>
      </section> */}

      <section className="flex gap-4">
        <button
          onClick={() => setShowAddTask(true)}
          className="bg-green-500 px-4 py-2 text-white rounded"
        >
          Add Task
        </button>

        <button
          onClick={downloadCSV}
          className="bg-blue-500 px-4 py-2 text-white rounded"
        >
          Download CSV
        </button>
        <button
          onClick={downloadExcel}
          className="bg-yellow-500 px-4 py-2 text-white rounded"
        >
          Download Excel
        </button>
        <button
          onClick={downloadPDF}
          className="bg-red-500 px-4 py-2 text-white rounded"
        >
          Download PDF
        </button>
      </section>

      {showAddTask && (
        <AddTask
          onClose={() => setShowAddTask(false)}
          onTaskAdded={() => {
            fetchTasks(); // 🔁 re-fetch and recalculate everything
          }}

        />
      )}
    </div>
  );
};

export default Dashboard;
