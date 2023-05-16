import { TaskType } from "../types/boardTypes";
import { deleteTask } from "../utils/apiUtils";

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

export default function TodoTask(props: {
  task: TaskType;
  removeTaskCB: (id: number) => void;
}) {
  return (
    <div
      key={props.task.id}
      className="group bg-white rounded p-1 mx-2 my-4 border-black border-[1px]"
    >
      <div className="flex">
        <h3 className="text-base font-bold flex-1">{props.task.title}</h3>
        <button
          className="bg-green-600 text-white font-bold rounded p-1"
          onClick={(_) =>
            props.task.board_object &&
            removeTask(
              props.task.board_object.id,
              props.task.id,
              props.removeTaskCB
            )
          }
        >
          Mark As Complete
        </button>
      </div>
      <p className="text-sm">Date: {props.task.description.slice(0, 10)}</p>
      <p className="text-sm">Description: {props.task.description.slice(11)}</p>
    </div>
  );
}
