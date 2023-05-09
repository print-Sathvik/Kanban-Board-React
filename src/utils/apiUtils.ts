import { FormPost, StageType, TaskPost } from "../types/boardTypes";
import { UserPost } from "../types/userTypes";

const API_BASE_URL = "https://reactforall.onrender.com/api/";

type RequestType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const request = async (
  endpoint: string,
  method: RequestType = "GET",
  data: FormPost | TaskPost | UserPost | StageType | {} = {}
) => {
  let url;
  let payload: string;
  if (method === "GET") {
    const requestParams = data
      ? `?${Object.keys(data)
          .map((key) => `${key}=${data[key as keyof typeof data]}`)
          .join("&")}`
      : "";
    url = `${API_BASE_URL}${endpoint}${requestParams}`;
    payload = "";
  } else {
    url = `${API_BASE_URL}${endpoint}`;
    payload = data ? JSON.stringify(data) : "";
  }

  const token = localStorage.getItem("token");
  const auth = token ? "Token " + token : "";

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: method !== "GET" ? payload : null,
  });
  if (response.ok) {
    const jsonResponse = await response.json();
    return jsonResponse;
  } else {
    const errorJson = await response.json();
    throw Error(errorJson);
  }
};

export const me = async () => {
  const res = await request("users/me/", "GET");
  return res;
};

export const login = (username: string, password: string) => {
  return request("auth-token/", "POST", { username, password });
};

export const createBoard = (board: FormPost) => {
  return request("boards/", "POST", board);
};

export const getBoards = () => {
  return request("boards/", "GET");
};

export const getBoard = (id: number) => {
  return request(`boards/${id}`, "GET");
};

export const deleteBoard = (id: number) => {
  return request(`boards/${id}`, "DELETE");
};

export const getStages = () => {
  return request("status/", "GET");
};

export const createStage = (stage: FormPost) => {
  return request("status/", "POST", stage);
};

export const deleteStage = (id: number) => {
  return request(`status/${id}`, "DELETE");
};

export const updateStage = (id: number, form: FormPost) => {
  return request(`status/${id}`, "PUT", form);
};

export const createTask = (boards_pk: number, task: TaskPost) => {
  return request(`boards/${boards_pk}/tasks/`, "POST", task);
};

export const getTasks = (boards_pk: number) => {
  return request(`boards/${boards_pk}/tasks/`, "GET");
};
