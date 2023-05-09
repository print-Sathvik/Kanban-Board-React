import React, { useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditForm from "./EditForm";
import Modal from "./common/Modal";
import { updateStage } from "../utils/apiUtils";
import { FormPost, StageType, TaskType } from "../types/boardTypes";
import CreateBoard from "./CreateBoard";
import Task from "./Task";

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
  removeStageCB: (id: number) => void;
}) {
  const [edit, setEdit] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<boolean>(false);

  return (
    <div className="flex-1 m-4 rounded-xl bg-gray-300 min-h-full min-w-[300px] max-w-[500px] shadow-md border-2 border-purple-600">
      <div className="group flex justify-center bg-white rounded-t-xl">
        <h2 className="text-center p-2 text-xl">{props.title}</h2>
        <button
          onClick={(_) => setNewTask(true)}
          className="invisible group-hover:visible pr-2"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
        <button
          onClick={(_) => setEdit(true)}
          className="invisible group-hover:visible pr-2"
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
      {props.tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          stages={props.stages}
          dispatchTasksCB={props.dispatchTasksCB}
        />
      ))}

      <Modal open={edit} closeCB={() => setEdit(false)}>
        <EditForm
          handleSubmit={(form: FormPost) => {
            editStage(props.id, form);
            setEdit(false);
          }}
          type="Stage"
          closeCB={() => setEdit(false)}
          title={props.title}
          description={props.description}
        />
      </Modal>
      <Modal open={newTask} closeCB={() => setNewTask(false)}>
        <CreateBoard
          handleSubmit={props.addTasksCB}
          type="Task"
          closeCB={() => setNewTask(false)}
        />
      </Modal>
    </div>
  );
}

export default Stage;
