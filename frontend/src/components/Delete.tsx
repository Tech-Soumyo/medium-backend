import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BACKEND_URL } from "@/config";
import { deleteBlog } from "@/hooks/useBlog";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type BlogProps = {
  blogId: string;
};

// type Blog = {
//   id: string;
//   title: string;
//   content: string;
//   author: {
//     name: string;
//   };
// };

export const BlogDelete: React.FC<BlogProps> = ({ blogId }) => {
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
        // const authorName = localStorage.getItem("authorId");
        // setPost(res.data.blog);
        const currentUser = localStorage.getItem("user");
        setIsOwner(authorName === currentUser);
      } catch (error) {
        alert("Error while fetching the blog");
        console.log("Error while fetching the blog", error);
      }
    };
    fetchBlog();
  }, [blogId]);

  const handleDelete = async () => {
    if (!isOwner) {
      alert("You are not Authorized to delete this blog");
      return;
    }
    try {
      await deleteBlog(blogId);
    } catch (error) {
      console.log("Error while delete the blog: ", error);
      alert("Failed to delete blog");
    }
  };
  if (!isOwner) {
    return <div></div>;
  }
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete from
              your account and remove this data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
                navigate("/blogs");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
