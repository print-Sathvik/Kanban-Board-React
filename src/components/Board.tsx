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
  updateTask,
} from "../utils/apiUtils";
import Modal from "./common/Modal";
import CreateBoard from "./forms/CreateBoard";
import { DragDropContext } from "react-beautiful-dnd";

const initializeBoard = async (
  boardId: number,
  dispatchCB: React.Dispatch<BoardActions>
) => {
  try {
    const board = await getBoard(boardId);
    const allStagesofAllBoards = await getStages();
    const allStages = allStagesofAllBoards.results.filter(
      (stage: StageType) => String(boardId) === stage.description.split(" ")[0]
    );
    dispatchCB({
      type: "renderBoard",
      board: {
        ...board,
        stages: allStages.sort((a: StageType, b: StageType) => a.id - b.id),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const addStage = async (
  stage: FormPost,
  boardId: number,
  dispatchCB: React.Dispatch<BoardActions>
) => {
  try {
    const newStage = {
      ...stage,
      description: String(boardId) + " " + stage.description,
    };
    const addedStage = await createStage(newStage);
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

const parseTasks = (tasks: TaskType[]) => {
  let tags: string, colors: string;
  for (let i = 0; i < tasks.length; i++) {
    [tasks[i].image, tags, colors, tasks[i].description] =
      tasks[i].description.split("||");
    tasks[i].tags = tags ? tags.split(";") : [];
    tasks[i].colors = colors ? colors.split(";") : [];
  }
  return tasks;
};

const initializeTasks = async (
  boards_pk: number,
  dispatchTasksCB: React.Dispatch<TaskActions>
) => {
  try {
    const allTasks = await getTasks(boards_pk);
    dispatchTasksCB({
      type: "renderTasks",
      tasks: parseTasks(allTasks.results),
    });
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
    console.log(task.description);
    dispatchTasksCB({ type: "addTask", task: newTask });
  } catch (error) {
    console.log(error);
  }
};

const updateTaskStage = async (
  boards_pk: number,
  taskId: number,
  newStatusId: number,
  task: TaskType | undefined
) => {
  try {
    if (task === undefined) throw new Error("Inavlid Task");
    const updatedTask = {
      title: task.title,
      description:
        task.image +
        "||" +
        task.tags?.join(";") +
        "||" +
        task.colors?.join(";") +
        "||" +
        task.description,
      status: newStatusId,
    };
    await updateTask(boards_pk, taskId, updatedTask);
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
    case "updateStage":
      return {
        ...state,
        stages: state.stages.map((stage) =>
          stage.id === action.id
            ? {
                id: stage.id,
                title: action.title,
                description: action.description,
              }
            : stage
        ),
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
      return [...tasks, parseTasks([action.task])[0]];
    case "updateTaskStatus":
      const status_object = action.boardState.stages.find(
        (stage) => stage.id === action.statusId
      );
      return tasks.map((task) =>
        task.id === action.taskId
          ? { ...task, status_object: status_object }
          : task
      );
    case "updateTaskDetails":
      return tasks.map((task) =>
        task.id === action.task.id ? parseTasks([action.task])[0] : task
      );
    case "deleteTask":
      return tasks.filter((task) => task.id !== action.taskId);
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

      <DragDropContext
        onDragEnd={(result) => {
          if (
            result.destination === undefined ||
            result.destination === null ||
            result.destination.droppableId === result.source.droppableId ||
            boardState === null
          )
            return;
          updateTaskStage(
            boardState.id,
            Number(result.draggableId),
            Number(result.destination.droppableId),
            tasks.find((task) => task.id === Number(result.draggableId))
          );
          dispatchTasks({
            type: "updateTaskStatus",
            taskId: Number(result.draggableId),
            statusId: Number(result.destination?.droppableId),
            boardState: boardState,
          });
        }}
      >
        <div className="flex min-h-full overflow-x-auto flex-1">
          {boardState?.stages.map((stage) => (
            <Stage
              id={stage.id}
              key={stage.id}
              title={stage.title}
              description={stage.description}
              tasks={tasks.filter(
                (task) => task.status_object?.id === stage.id
              )}
              stages={boardState.stages}
              addTasksCB={(form: FormPost) =>
                addTask(props.id, stage.id, form, dispatchTasks)
              }
              removeStageCB={(id) => removeStage(id).then(res => dispatch({type:"removeStage", id: id}))}
              updateStageCB={(form: FormPost) =>
                dispatch({
                  type: "updateStage",
                  id: stage.id,
                  title: form.title,
                  description: form.description,
                })
              }
              removeTaskCB={(id) =>
                dispatchTasks({ type: "deleteTask", taskId: id })
              }
              dispatchTasksCB={(taskId: number, statusId: number) =>
                dispatchTasks({
                  type: "updateTaskStatus",
                  taskId: taskId,
                  statusId: statusId,
                  boardState,
                })
              }
              updateTaskState={(task: TaskType) =>
                dispatchTasks({ type: "updateTaskDetails", task: task })
              }
            />
          ))}
        </div>
      </DragDropContext>
      <Modal open={newStage} closeCB={() => setNewStage(false)}>
        <CreateBoard
          handleSubmit={(stage) => {
            boardState && addStage(stage, boardState.id, dispatch);
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
