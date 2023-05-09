import { StageType, TaskType } from "../types/boardTypes";

export default function Task(props: {
  task: TaskType;
  stages: StageType[];
  dispatchTasksCB: (taskId: number, statusId: number) => void;
}) {
  return (
    <div
      key={props.task.id}
      className="group bg-white rounded p-1 mx-2 my-4 border-black border-[1px]"
    >
      <h3 className="text-base font-bold">{props.task.title}</h3>
      <p className="text-sm">{props.task.description}</p>
      <select
        className="invisible group-hover:visible pr-2"
        onChange={(e) =>
          props.dispatchTasksCB(props.task.id, Number(e.target.value))
        }
      >
        {props.stages.map((stage) => (
          <option value={stage.id} key={stage.id}>
            {stage.title}
          </option>
        ))}
      </select>
    </div>
  );
}
