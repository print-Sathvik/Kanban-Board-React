import { useEffect, useState } from "react";
import { Board } from "../types/boardTypes";
import { deleteBoard, getBoards } from "../utils/apiUtils";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Link, navigate } from "raviger";
import { User } from "../types/userTypes";

const initializeAllBoards = async (
  setAllBoardsCB: (allBoards: Board[]) => void
) => {
  try {
    const response = await getBoards();
    setAllBoardsCB(
      response.results.filter((board: Board) => board.title !== "TODO TODO")
    );
  } catch (error) {
    console.log(error);
  }
};

const removeBoard = async (id: number) => {
  try {
    await deleteBoard(id);
  } catch (error) {
    console.log(error);
  }
};

export default function Home(props: { currentUser: User | null }) {
  const [allBoards, setAllBoards] = useState<Board[] | null>(null);

  useEffect(() => {
    initializeAllBoards(setAllBoards);
  }, []);

  return (
    <div className="divide-y-2 p-3">
      {allBoards
        ?.filter(
          (board: Board) => board //board.title.toLowerCase().includes(search?.toLowerCase() || "") TODO: Implement Search
        )
        .map((board: Board) => (
          <div
            key={board.id}
            className="flex"
            onClick={(_) => navigate(`/boards/${board.id}`)}
          >
            <h2 className="py-4 px-2 flex-1">
              {board.title || "Untitled board"}
            </h2>
            <p className="py-4 flex-1">{board.description}</p>
            <Link href={`/boards/${board.id}`} className="p-2 my-2">
              <ArrowTopRightOnSquareIcon color="purple" className="w-6 h-6" />
            </Link>
            <button
              className="px-2 my-2"
              onClick={() => {
                const deleteResult = board.id && removeBoard(board.id);
                if (deleteResult)
                  setAllBoards(
                    allBoards.filter((savedboard) => board.id !== savedboard.id)
                  );
              }}
            >
              <TrashIcon color="red" className="w-6 h-6" />
            </button>
          </div>
        ))}
    </div>
  );
}
