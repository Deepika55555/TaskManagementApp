// src/api/auth.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async ({ email, password }) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};


export const registerUser = async ({ name, email, password }) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
};
