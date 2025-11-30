import api from "./api";
import {LoginPayload, User} from '../../types/login'

export const registerUser = async (data: any) => {
  return api.post("/users", data)
};

export const loginUser = async (data: LoginPayload) => {
  const res = await api.post("/login", data);
  return res.data;
};