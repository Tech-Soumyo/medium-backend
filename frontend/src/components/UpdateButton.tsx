import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type BlogProps = {
  blogId: string;
};

export const BlogEdit: React.FC<BlogProps> = ({ blogId }) => {
  const navigate = useNavigate();
  // const [post, setPost] = useState<Blog | null>(null);
  const [isOwner, setIsOwner] = useState<Boolean>(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/blog/${blogId}`, {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        });
        console.log(res.data.blog);
        const authorName = res.data.blog.authorId;

        const currentUser = localStorage.getItem("user");
        setIsOwner(authorName === currentUser);
        // localStorage.setItem("blogId", res.data.blog.id);
      } catch (error) {
        alert("Error while fetching the blog");
        console.log("Error while fetching the blog", error);
      }
    };
    fetchBlog();
  }, [blogId]);

  const handleEdit = async () => {
    if (!isOwner) {
      alert("You are not Authorized to delete this blog");
      return;
    }
    navigate(`/update/${blogId}`);
  };
  if (!isOwner) {
    // localStorage.setItem("isOwner", stringify(isOwner));
    return <div></div>;
  }
  return (
    <div>
      <button
        onClick={handleEdit}
        type="button"
        className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
      >
        Edit
      </button>
    </div>
  );
};
