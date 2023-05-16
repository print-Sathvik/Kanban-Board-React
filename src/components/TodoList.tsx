import { useEffect, useState } from "react";
import { Board, BoardState, StageType, TaskType } from "../types/boardTypes";
import {
  createBoard,
  createStage,
  createTask,
  getBoards,
  getStages,
  getTasks,
} from "../utils/apiUtils";
import Modal from "./common/Modal";
import CreateTodo from "./forms/CreateTodo";
import TodoTask from "./TodoTask";

const initializeTodo = async (
  setTodoStageCB: React.Dispatch<React.SetStateAction<StageType | null>>,
  setBoardCB: React.Dispatch<React.SetStateAction<BoardState | null>>
) => {
  try {
    const allStages = await getStages();
    let stage = allStages.results.find((stage: StageType) =>
      stage.description.startsWith("0 ")
    );
    const allBoards = await getBoards();
    let board = allBoards.results.find(
      (board: Board) => board.title === "TODO TODO"
    );
    if (board === undefined)
      board = await createBoard({
        title: "TODO TODO",
        description: "This board is dedicated to todo list",
      });
    if (stage === undefined) {
      stage = await createStage({
        title: "TODO List",
        description: "0 This is only for todo list",
      });
    }
    setTodoStageCB(stage);
    setBoardCB(board);
  } catch (error) {
    console.log(error);
  }
};

const initializeTasks = async (
  boardId: number,
  setTasksCB: React.Dispatch<React.SetStateAction<TaskType[] | null>>,
  setAllTodosCB: React.Dispatch<React.SetStateAction<TaskType[] | null>>
) => {
  try {
    const allTasks = await getTasks(boardId);
    setTasksCB(allTasks.results);
    setAllTodosCB(allTasks.results);
  } catch (error) {
    console.log(error);
  }
};

const addTodo = async (
  title: string,
  description: string,
  dueDate: string,
  statusId: number,
  boardId: number
) => {
  const task = { title: title, description: dueDate + " " + description };
  try {
    const newTask = await createTask(boardId, { ...task, status: statusId });
    return newTask;
  } catch (error) {
    console.log(error);
  }
};

export default function TodoList() {
  const [board, setBoard] = useState<BoardState | null>(null);
  const [todoStage, setTodoStage] = useState<StageType | null>(null);
  const [allTodos, setAllTodos] = useState<TaskType[] | null>(null);
  const [todoTasks, setTodoTasks] = useState<TaskType[] | null>(null);
  //This will hold filtered values from allTodos
  const [newTask, setNewTask] = useState<boolean>(false);
  const [beforeDate, setBeforeDate] = useState("");
  const [afterDate, setAfterDate] = useState("");

  useEffect(() => {
    initializeTodo(setTodoStage, setBoard);
  }, []);

  useEffect(() => {
    board && initializeTasks(board.id, setTodoTasks, setAllTodos);
  }, [board]);

  if (todoStage === null || board === null) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex">
        <h1 className="text-2xl p-2">ToDo List</h1>
        <button
          className="rounded text-white font-bold bg-purple-600 hover:bg-purple-800 m-2 px-1"
          onClick={(_) => setNewTask(true)}
        >
          New Task
        </button>
        <label htmlFor="afterDate" className="p-2">
          After :
        </label>
        <input
          type="date"
          id="afterDate"
          className="rounded border-2 border-gray-400 mt-1"
          value={afterDate}
          onChange={(e) => setAfterDate(e.target.value)}
        />
        <label htmlFor="beforeDate" className="p-2">
          Before :
        </label>
        <input
          type="date"
          id="beforeDate"
          className="rounded border-2 border-gray-400 mt-1"
          value={beforeDate}
          onChange={(e) => setBeforeDate(e.target.value)}
        />
        <button
          className="rounded text-white font-bold bg-green-600 hover:bg-green-800 m-2 px-1"
          onClick={(_) =>
            allTodos &&
            setTodoTasks(
              allTodos.filter(
                (todo) =>
                  todo.description.slice(0, 10) < beforeDate &&
                  todo.description.slice(0, 10) > afterDate
              )
            )
          }
        >
          Filter
        </button>
        <button
          className="rounded text-white font-bold bg-green-600 hover:bg-green-800 m-2 px-1"
          onClick={(_) => {
            allTodos && setTodoTasks(allTodos);
            setAfterDate("");
            setBeforeDate("");
          }}
        >
          Clear Filter
        </button>
      </div>
      {todoTasks?.map((task, index) => (
        <TodoTask
          task={task}
          key={index}
          removeTaskCB={(id) =>
            setTodoTasks(todoTasks.filter((task) => task.id !== id))
          }
        />
      ))}
      <Modal open={newTask} closeCB={() => setNewTask(false)}>
        <CreateTodo
          handleSubmit={(task) => {
            addTodo(
              task.title,
              task.description,
              task.dueDate,
              todoStage.id,
              board.id
            ).then((res) => {
              allTodos && setTodoTasks([...allTodos, res]);
              allTodos && setAllTodos([...allTodos, res]);
            });
            setNewTask(false);
          }}
          closeCB={() => setNewTask(false)}
        />
      </Modal>
    </div>
  );
}
