import { Appbar } from "@/components/AppBar";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const UpdateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  //   const blogId = localStorage.getItem("blogId");
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        await axios
          .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
              Authorization: localStorage.getItem("token") || "",
            },
          })
          .then((response) => {
            setTitle(response.data.blog.title);
            setContent(response.data.blog.content);
          });
      } catch (error) {
        alert("Error while fetching the blog");
        console.log("Error while fetching the blog", error);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return "User not signed in";
    }
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/blog/update/${id}`,
        {
          id,
          title,
          content,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );
      console.log("after change", title);
    } catch (error) {
      console.error("Error updating the blog:", error);
      return "Failed to update the blog";
    }
  };
  return (
    <div>
      <Appbar />
      <div className="flex flex-col gap-8 p-4 md:p-10">
        <div className="my-2 w-full">
          <input
            type="text"
            id="first_name"
            className="bg-gray-50 text-gray-900 text-lg hover:border-blue-500 focus:border-blue-800 active:border-blue-800 outline-none block w-full p-4"
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <TextEditor
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <div className="my-1">
          <button
            type="submit"
            onClick={() => {
              handleSubmit();
              navigate(`/blog/${id}`);
            }}
            className="mt-0 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
function TextEditor({
  onChange,
  value,
}: {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
}) {
  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between border">
        <div className="my-2 bg-white rounded-b-lg w-full">
          <label className="sr-only">Publish post</label>
          <textarea
            id="editor"
            rows={8}
            className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2"
            placeholder="Write an article..."
            required
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
