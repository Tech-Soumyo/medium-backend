import { Appbar } from "../components/AppBar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks/useBlog";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const publishedDateString = new Date(Date.now()).toLocaleDateString("en-US");

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center">
          <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="space-y-8 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl">
        {/* <div className={`min-w-${96}`}> */}
        {blogs.map((blog: any) => (
          <BlogCard
            id={blog.id}
            authorName={blog.author.name || "Anonymous"}
            title={blog.title}
            content={blog.content}
            publishedDate={publishedDateString}
            key={blog.id}
          />
        ))}
      </div>
    </div>
    // </div>
  );
};
