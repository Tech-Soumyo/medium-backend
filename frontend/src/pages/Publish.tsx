import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { Appbar } from "../components/AppBar";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      <Appbar />
      <div className="flex flex-col gap-8 p-4 md:p-10">
        <div className="my-2 w-full">
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            id="title"
            className="bg-gray-50 text-gray-900 text-lg hover:border-blue-500 focus:border-blue-800 active:border-blue-800 outline-none block w-full p-4"
            placeholder="Title"
          />
        </div>
        <TextEditor
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <div className="my-1 ">
          <button
            onClick={async () => {
              const response = await axios.post(
                `${BACKEND_URL}/api/v1/blog`,
                {
                  title,
                  content: description,
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("token") || "",
                  },
                }
              );
              // localStorage.setItem("authorId", response.data.user_id);
              // localStorage.setItem("blogId", response.data.id);
              navigate(`/blog/${response.data.id}`);
            }}
            type="submit"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish post
          </button>
        </div>
      </div>
    </div>
  );
};

function TextEditor({
  onChange,
}: {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="w-full mb-4 ">
      <div className="flex items-center justify-between border">
        <div className="my-2 bg-white rounded-b-lg w-full">
          <label className="sr-only">Publish post</label>
          <textarea
            onChange={onChange}
            id="editor"
            rows={8}
            className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2"
            placeholder="Write an article..."
            required
          />
        </div>
      </div>
    </div>
  );
}
