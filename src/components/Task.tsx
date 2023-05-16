import { Draggable } from "react-beautiful-dnd";
import { FormPost, TaskType } from "../types/boardTypes";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { deleteTask, updateTask } from "../utils/apiUtils";
import { useState } from "react";
import Modal from "./common/Modal";
import CreateTask from "./forms/CreateTask";

const removeTask = async (
  boardId: number,
  taskId: number,
  removeTaskCB: (id: number) => void
) => {
  try {
    await deleteTask(boardId, taskId);
    removeTaskCB(taskId);
  } catch (error) {
    console.log(error);
  }
};

const updateTaskDetails = async (
  boards_pk: number,
  taskId: number,
  newStatusId: number,
  task: FormPost
) => {
  try {
    if (task === undefined) throw new Error("Inavlid Task");
    const updatedTask = await updateTask(boards_pk, taskId, {
      ...task,
      status: newStatusId,
    });
    return updatedTask;
  } catch (error) {
    console.log(error);
  }
};

export default function Task(props: {
  task: TaskType;
  index: number;
  dispatchTasksCB: (taskId: number, statusId: number) => void;
  removeTaskCB: (id: number) => void;
  updateTaskState: (task: TaskType) => void;
}) {
  const [edit, setEdit] = useState<boolean>(false);

  return (
    <div>
      <Draggable draggableId={String(props.task.id)} index={props.index}>
        {(provided) => (
          <div
            key={props.task.id}
            onClick={(_) => setEdit(true)}
            className="group bg-white rounded p-1 mx-2 my-4 border-black border-[1px]"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="flex">
              <h3 className="text-base font-bold flex-1">{props.task.title}</h3>
              <button
                onClick={(_) =>
                  props.task.board_object &&
                  removeTask(
                    props.task.board_object.id,
                    props.task.id,
                    props.removeTaskCB
                  )
                }
              >
                <XMarkIcon className="w-4 h-4 invisible group-hover:visible" />
              </button>
            </div>
            {props.task.tags?.map(
              (tag, index) =>
                props.task.colors && (
                  <div
                    key={index}
                    style={{ backgroundColor: `${props.task.colors[index]}` }}
                    className={"px-1 m-1 rounded-3xl text-sm inline-flex"}
                  >
                    {/* Tailwind cannot compile bg color dynamically, that's why had to use style attribute */}
                    {tag}
                  </div>
                )
            )}
            {props.task.image && (
              <img src={props.task.image} className="py-2" alt="Task" />
            )}
            <p className="text-sm">{props.task.description}</p>
          </div>
        )}
      </Draggable>
      <Modal open={edit} closeCB={() => setEdit(false)}>
        <CreateTask
          task={props.task}
          handleSubmit={(task) =>
            props.task.board_object &&
            props.task.status_object &&
            updateTaskDetails(
              props.task.board_object.id,
              props.task.id,
              props.task.status_object?.id,
              task
            ).then((res) => props.updateTaskState(res))
          }
          closeCB={() => setEdit(false)}
        />
      </Modal>
    </div>
  );
}
