import React, { useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditForm from "./forms/EditForm";
import Modal from "./common/Modal";
import { updateStage } from "../utils/apiUtils";
import { FormPost, StageType, TaskType } from "../types/boardTypes";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";
import CreateTask from "./forms/CreateTask";

const editStage = async (id: number, form: FormPost) => {
  try {
    await updateStage(id, form);
  } catch (error) {
    console.log(error);
  }
};

function Stage(props: {
  id: number;
  title: string;
  description: string;
  tasks: TaskType[];
  stages: StageType[];
  dispatchTasksCB: (taskId: number, statusId: number) => void;
  addTasksCB: (form: FormPost) => void;
  updateStageCB: (form: FormPost) => void;
  removeStageCB: (id: number) => void;
  removeTaskCB: (taskId: number) => void;
  updateTaskState: (task: TaskType) => void;
}) {
  const [edit, setEdit] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<boolean>(false);

  return (
    <div>
      <Droppable droppableId={String(props.id)}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 m-4 rounded-xl bg-gray-300 min-h-full min-w-[300px] max-w-[500px] shadow-md border-2 border-purple-600"
          >
            <div className="group flex justify-center bg-white rounded-t-xl">
              <h2 className="text-center p-2 text-xl">{props.title}</h2>
              <button onClick={(_) => setNewTask(true)} className="pr-2">
                <PlusIcon className="w-5 h-5" />
              </button>
              <button
                onClick={(_) => setEdit(true)}
                title="Delete"
                className="invisible group-hover:visible pr-2 hover:relative"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={(_) => props.removeStageCB(props.id)}
                className="invisible group-hover:visible"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            <hr className="bg-purple-600 h-0.5" />
            {props.tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                dispatchTasksCB={props.dispatchTasksCB}
                removeTaskCB={props.removeTaskCB}
                updateTaskState={props.updateTaskState}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <Modal open={edit} closeCB={() => setEdit(false)}>
        <EditForm
          handleSubmit={(form: FormPost) => {
            const boardIdStr = props.description.split(" ", 1)[0];
            form.description = boardIdStr + " " + form.description;
            editStage(props.id, form).then((res) => props.updateStageCB(form));
            setEdit(false);
          }}
          type="Stage"
          closeCB={() => setEdit(false)}
          title={props.title}
          description={props.description.slice(
            props.description.indexOf(" ") + 1
          )}
        />
      </Modal>
      <Modal open={newTask} closeCB={() => setNewTask(false)}>
        <CreateTask
          handleSubmit={props.addTasksCB}
          closeCB={() => setNewTask(false)}
        />
      </Modal>
    </div>
  );
}

export default Stage;
