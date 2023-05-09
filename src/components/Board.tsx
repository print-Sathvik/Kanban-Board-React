/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useReducer, useState } from "react";
import Stage from "./Stage";
import { BoardState, FormPost, StageType, TaskType } from "../types/boardTypes";
import { BoardActions, TaskActions } from "../types/actionTypes";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  createStage,
  createTask,
  deleteStage,
  getBoard,
  getStages,
  getTasks,
} from "../utils/apiUtils";
import Modal from "./common/Modal";
import CreateBoard from "./CreateBoard";

const initializeBoard = async (
  id: number,
  dispatchCB: React.Dispatch<BoardActions>
) => {
  try {
    const board = await getBoard(id);
    const allStages = await getStages();
    dispatchCB({
      type: "renderBoard",
      board: {
        ...board,
        stages: allStages.results.sort(
          (a: StageType, b: StageType) => a.id - b.id
        ),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const addStage = async (
  stage: FormPost,
  dispatchCB: React.Dispatch<BoardActions>
) => {
  try {
    const addedStage = await createStage(stage);
    dispatchCB({
      type: "addStage",
      id: addedStage.id,
      title: addedStage.title,
      description: addedStage.description,
    });
  } catch (error) {
    console.log(error);
  }
};

const removeStage = async (id: number) => {
  try {
    await deleteStage(id);
  } catch (error) {
    console.log(error);
  }
};

const initializeTasks = async (
  boards_pk: number,
  dispatchTasksCB: React.Dispatch<TaskActions>
) => {
  try {
    const allTasks = await getTasks(boards_pk);
    dispatchTasksCB({ type: "renderTasks", tasks: allTasks.results });
  } catch (error) {
    console.log(error);
  }
};

const addTask = async (
  boards_pk: number,
  statusId: number,
  task: FormPost,
  dispatchTasksCB: React.Dispatch<TaskActions>
) => {
  try {
    const newTask = await createTask(boards_pk, { ...task, status: statusId });
    dispatchTasksCB({ type: "addTask", task: newTask });
  } catch (error) {
    console.log(error);
  }
};

const reducer: (
  state: BoardState | null,
  action: BoardActions
) => BoardState | null = (state: BoardState | null, action: BoardActions) => {
  if (action.type === "renderBoard") return action.board;
  if (state === null) return state;
  switch (action.type) {
    case "addStage":
      return {
        ...state,
        stages: [
          ...state.stages,
          {
            id: action.id,
            title: action.title,
            description: action.description,
          },
        ],
      };
    case "removeStage":
      return {
        ...state,
        stages: state.stages.filter((stage) => stage.id !== action.id),
      };
  }
};

const taskReducer: (tasks: TaskType[], action: TaskActions) => TaskType[] = (
  tasks: TaskType[],
  action: TaskActions
) => {
  switch (action.type) {
    case "renderTasks":
      return action.tasks;
    case "addTask":
      return [...tasks, action.task];
    case "updateTaskStatus":
      const status_object = action.boardState.stages.find(
        (stage) => stage.id === action.statusId
      );
      return tasks.map((task) =>
        task.id === action.taskId
          ? { ...task, status_object: status_object }
          : task
      );
  }
};

function Board(props: { id: number }) {
  const [boardState, dispatch] = useReducer(reducer, null);
  const [newStage, setNewStage] = useState<boolean>(false);
  const [tasks, dispatchTasks] = useReducer(taskReducer, []);

  useEffect(() => {
    initializeBoard(props.id, dispatch);
    initializeTasks(props.id, dispatchTasks);
  }, []);

  return (
    <div className="flex-col h-full pt-1">
      <div className="flex flex-1">
        <h1 className="text-2xl pl-5">{boardState?.title}</h1>
        <button
          className="rounded-full w-8 h-8 ml-3 bg-purple-600 align-center"
          onClick={(_) => setNewStage(true)}
        >
          <PlusIcon className="w-6 h-6 text-center m-1" color="white" />
        </button>
      </div>
      <div className="flex min-h-full overflow-x-auto flex-1">
        {boardState?.stages.map((stage) => (
          <Stage
            id={stage.id}
            key={stage.id}
            title={stage.title}
            description={stage.description}
            tasks={tasks.filter((task) => task.status_object?.id === stage.id)}
            stages={boardState.stages}
            dispatchTasksCB={(taskId: number, statusId: number) =>
              dispatchTasks({
                type: "updateTaskStatus",
                taskId: taskId,
                statusId: statusId,
                boardState,
              })
            }
            addTasksCB={(form: FormPost) =>
              addTask(props.id, stage.id, form, dispatchTasks)
            }
            removeStageCB={(id) => removeStage(id)}
          />
        ))}
      </div>
      <Modal open={newStage} closeCB={() => setNewStage(false)}>
        <CreateBoard
          handleSubmit={(stage) => {
            addStage(stage, dispatch);
            setNewStage(false);
          }}
          type="Stage"
          closeCB={() => setNewStage(false)}
        />
      </Modal>
    </div>
  );
}

export default Board;
