import { BoardState, TaskType } from "./boardTypes";

type renderBoard = {
  type: "renderBoard";
  board: BoardState;
};

type addStage = {
  id: number;
  type: "addStage";
  title: string;
  description: string;
};

type removeStage = {
  type: "removeStage";
  id: number;
};

type updateStage = {
  type: "updateStage";
  id: number;
  title: string;
  description: string;
};

type BoardActions = renderBoard | addStage | removeStage | updateStage;

type renderTasks = {
  type: "renderTasks";
  tasks: TaskType[];
};

type addTaskAction = {
  type: "addTask";
  task: TaskType;
};

type updateTaskStatus = {
  type: "updateTaskStatus";
  taskId: number;
  statusId: number;
  boardState: BoardState;
};

type updateTaskDetails = {
  type: "updateTaskDetails";
  task: TaskType;
};

type deleteTask = {
  type: "deleteTask";
  taskId: number;
};

type TaskActions =
  | renderTasks
  | addTaskAction
  | updateTaskStatus
  | updateTaskDetails
  | deleteTask;

type TodoPost = {
  title: string;
  description: string;
  dueDate: string;
};

export type { BoardActions, TaskActions, TodoPost };
