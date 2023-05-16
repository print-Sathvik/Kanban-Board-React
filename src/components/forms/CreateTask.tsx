import React, { useState } from "react";
import {
  FormPost,
  Errors,
  validateForm,
  TaskType,
} from "../../types/boardTypes";

export default function CreateTask(props: {
  task?: TaskType;
  handleSubmit: (task: FormPost) => void;
  closeCB: () => void;
}) {
  //Form for editing an existing task or to create new task
  const [task, setTask] = useState({
    title: props.task ? props.task.title : "",
    description: props.task ? props.task.description : "",
    image: props.task ? props.task.image : "",
    tag: "",
    color: "",
  });
  const [errors, setErrors] = useState<Errors<FormPost>>({});
  const [tags, setTags] = useState<String[]>(
    props.task && props.task.tags ? props.task.tags : []
  );
  const [colors, setColors] = useState<String[]>(
    props.task && props.task.colors ? props.task.colors : []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(task);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      props.closeCB();
      task.description =
        task.image +
        "||" +
        tags?.join(";") +
        "||" +
        colors?.join(";") +
        "||" +
        task.description;
      props.handleSubmit({ title: task.title, description: task.description });
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_tag, ind) => ind !== index));
    setColors(colors.filter((_color, ind) => ind !== index));
  };

  return (
    <div className="w-full max-w-lg divide-y divide-gray-200">
      <h1 className="text-2xl my-2 text-gray-700">Create Task</h1>
      <form className="py-4" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label
            htmlFor="title"
            className={`${errors.title ? "text-red-500" : ""}`}
          >
            Title
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded p-2 my-2 flex-1"
            name="title"
            id="title"
            value={task.title}
            onChange={(e) => {
              setTask({ ...task, title: e.target.value });
            }}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div className="mb-2">
          <label
            htmlFor="description"
            className={`${errors.description ? "text-red-500" : ""}`}
          >
            Description
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded p-2 my-2 flex-1"
            name="description"
            id="description"
            value={task.description ?? ""}
            onChange={(e) => {
              setTask({ ...task, description: e.target.value });
            }}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>
        <div className="mb-2">
          <label
            htmlFor="image"
            className={`${errors.description ? "text-red-500" : ""}`}
          >
            Image URL(drive, dropbox or any url)
          </label>
          <input
            type="url"
            className="w-full border-2 border-gray-200 rounded p-2 my-2 flex-1"
            name="image"
            id="image"
            value={task.image ?? ""}
            onChange={(e) => {
              setTask({ ...task, image: e.target.value });
            }}
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="tags"
            className={`${errors.description ? "text-red-500" : ""}`}
          >
            Tag and Color
          </label>
          {tags.map((tag, index) => (
            <div
              key={index}
              style={{ backgroundColor: `${colors[index]}` }}
              className={"px-1 m-1 rounded-3xl text-sm inline-flex"}
            >
              {tag} | <button onClick={() => removeTag(index)}>X</button>
            </div>
          ))}
          <div className="flex">
            <input
              type="text"
              className="border-2 border-gray-200 rounded p-2 m-2 w-5/12"
              name="tag"
              id="tag"
              value={task.tag ?? ""}
              onChange={(e) => {
                setTask({ ...task, tag: e.target.value });
              }}
            />
            <input
              type="color"
              className="w-10 h-10 p-0 m-auto border-0 cursor-pointer"
              name="color"
              id="color"
              value={task.color ?? "#ff0000"}
              onChange={(e) => {
                setTask({ ...task, color: e.target.value });
              }}
            />
            <button
              type="button"
              className=" bg-purple-500 rounded h-fit text-white font-bold py-2 px-1 m-auto"
              onClick={() => {
                setTags([...tags, task.tag]);
                setColors([...colors, task.color]);
              }}
            >
              Add Tag
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {props.task ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={props.closeCB}
          className="m-3 inline-flex float-right w-full justify-center rounded bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
