// src/tasks/taskService.js
import axios from "axios";

const URL = process.env.REACT_APP_API_URL;


const API_URL = `${URL}/api/tasks`;

export const getTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createTask = async (taskData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API_URL, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const updateTask = async (taskId, updatedData) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/${taskId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const deleteTask = async (taskId) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
