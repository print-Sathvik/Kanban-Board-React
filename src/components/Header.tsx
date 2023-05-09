import { ActiveLink, navigate } from "raviger";
import { User } from "../types/userTypes";
import { useState } from "react";
import Modal from "./common/Modal";
import CreateBoard from "./CreateBoard";
import { FormPost } from "../types/boardTypes";
import { createBoard } from "../utils/apiUtils";

const addBoard = async (board: FormPost) => {
  try {
    await createBoard(board);
    navigate(`/`); //TODO: replace link
  } catch (error) {
    console.log(error);
  }
};

export default function Header(props: { currentUser: User | null }) {
  const [newForm, setNewForm] = useState<boolean>(false);

  return (
    <div className="flex gap-2 w-full border-b-2">
      <div className="float-right w-full pl-1 pr-10">
        {[
          { page: "Home", url: "/" },
          { page: "About", url: "/about" },
          ...(props.currentUser && props.currentUser.username.length > 0
            ? [
                {
                  page: "Logout",
                  onClick: () => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  },
                },
                {
                  page: "+New Board",
                  onClick: () => setNewForm(true),
                  class:
                    "bg-purple-600 rounded p-2 text-white font-bold float-right align-center mt-2",
                },
              ]
            : [{ page: "Login", url: "/login" }]),
        ]
          .reverse()
          .map((link) =>
            link.url ? (
              <ActiveLink
                key={link.url}
                href={link.url}
                className="p-2 px-4 m-2 mx-4 float-right"
                exactActiveClass="border-b-4 border-purple-600"
              >
                {link.page}
              </ActiveLink>
            ) : (
              <button
                key={link.page}
                onClick={link.onClick}
                className={link.class ?? "p-2 px-4 m-2 mx-4 float-right"}
              >
                {link.page}
              </button>
            )
          )}
      </div>
      <Modal open={newForm} closeCB={() => setNewForm(false)}>
        <CreateBoard
          handleSubmit={(board) => addBoard(board)}
          type="Board"
          closeCB={() => setNewForm(false)}
        />
      </Modal>
    </div>
  );
}
