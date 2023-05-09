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

type BoardActions = renderBoard | addStage | removeStage;

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

type TaskActions = renderTasks | addTaskAction | updateTaskStatus;

export type { BoardActions, TaskActions };
