// import { useEffect, useState } from "react";
// import axios from "axios";
// import { BACKEND_URL } from "../config";
// import { useNavigate } from "react-router-dom";

// export interface Blog {
//   content: string;
//   title: string;
//   id: number;
//   author: {
//     name: string;
//   };
// }

// export const useBlog = ({ id }: { id: string }) => {
//   const [loading, setLoading] = useState(true);
//   const [blog, setBlog] = useState<Blog>();

//   useEffect(() => {
//     axios
//       .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
//         headers: {
//           Authorization: localStorage.getItem("token") || "",
//         },
//       })
//       .then((response) => {
//         setBlog(response.data.blog);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Failed to fetch blogs:", error);
//         setLoading(false);
//       });
//   }, [id]);

//   return {
//     loading,
//     blog,
//   };
// };
// export const useBlogs = () => {
//   const [loading, setLoading] = useState<Boolean>(true);
//   const [blogs, setBlogs] = useState<Blog[]>([]);

//   useEffect(() => {
//     axios
//       .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       })
//       .then((response) => {
//         setBlogs(response.data.blogs);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error(error);
//         setLoading(false);
//       });
//   }, []);

//   return {
//     loading,
//     blogs,
//   };
// };

// export async function deleteBlog(blogId: string) {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   if (!token) {
//     navigate("/signin");
//   }
//   const response = await axios.delete(
//     `${BACKEND_URL}/api/v1/blog/delete/${blogId}`,
//     {
//       headers: {
//         Authorization: token,
//       },
//     }
//   );
//   return response.data.message;
// }

import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export interface Blog {
  date: string;
  content: string;
  title: string;
  id: string;
  author: {
    name: string;
  };
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setBlog(response.data.blog);
        // localStorage.setItem("authorId", response.data.blog.authorId);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch blogs:", error);
        setLoading(false);
      });
  }, [id]);

  return {
    loading,
    blog,
  };
};
export const useBlogs = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlogs(response.data.blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch blogs:", error);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    blogs,
  };
};

export async function deleteBlog(blogId: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    const navigate = useNavigate();
    navigate("/signin");
    return "User not Signed In";
  }
  try {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/blog/delete/${blogId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(response.data.message);
    return response.data.message;
  } catch (error) {
    console.error("Error deleting the blog:", error);
    return "Failed to delete the blog";
  }
}

export const editBlog = async (
  title: string,
  content: string,
  blogId: string
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    const navigate = useNavigate();
    navigate("/signin");
    return "User not Signed In";
  }
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/v1/blog/update/${blogId}`,
      {
        title,
        content,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(response.data.message);
    // return response.data.message;
  } catch (error) {
    console.error("Error deleting the blog:", error);
    return "Failed to delete the blog";
  }
};
