import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: number;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  let minutes: string = Math.ceil(content.split(/\s+/).length / 100).toString();
  return (
    <Link to={`/blog/${id}`}>
      <div className="max-w-md mx-auto bg-slate-70 rounded-xl shadow-md overflow-hidden md:max-w-4xl p-4 ">
        <div className="md:flex">
          <div className="p-11">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {authorName}
            </div>
            <a
              href="#"
              className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
            >
              {title}
            </a>
            <p className="mt-2 text-gray-500">{truncateText(content, 100)}</p>
          </div>
          <div className="flex justify-end items-center flex-grow">
            <div className="invisible lg:visible ">
              <Avatar name={authorName.toUpperCase()} />
              <div className="text-xs font-thin text-gray-900">
                {authorName}
              </div>
            </div>
            <div className="ml-3 ">
              <div className="flex space-x-1 text-sm text-gray-500 invisible lg:visible">
                <time dateTime={publishedDate}>{publishedDate}</time>
              </div>
              <div className="text-xs mt-5 font-thin invisible lg:visible">
                {minutes} min read
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-500 ml-2"></div>;
}

// export function Avatar({
//   name,
//   size = "small",
// }: {
//   name: string;
//   size?: "small" | "big";
// }) {
//   const initial = name ? name[0] : "?";
//   return (
//     <div
//       aria-label={name}
//       className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full hover:bg-slate-100  ${
//         size === "small" ? "w-6 h-6" : "w-10 h-10"
//       }`}
//     >
//       <span
//         className={` ${
//           size === "small" ? "text-xs" : "text-md"
//         } font-extralight text-gray-300 hover:text-black`}
//       >
//         {initial}
//       </span>
//     </div>
//   );
// }

// Helper function for truncating text
export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  const initial = name ? name[0] : "?";
  return (
    <div
      aria-label={name}
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full transition-colors duration-200 ${
        size === "small" ? "w-6 h-6" : "w-10 h-10"
      } hover:bg-slate-200`}
    >
      <span
        className={`transition-colors duration-200 ${
          size === "small" ? "text-xs" : "text-md"
        } font-semibold text-gray-300 hover:text-black`}
      >
        {initial}
      </span>
    </div>
  );
}

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
