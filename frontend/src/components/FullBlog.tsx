import axios from "axios";
import { Appbar } from "./AppBar";
import { useState } from "react";
import { BlogDelete } from "./Delete";
import { BlogEdit } from "./UpdateButton";
import { Avatar } from "./BlogCard";
type Blog = {
  author: {
    name: string;
  };
  content: string;
  id: string;
  title: string;
};

export const FullBlog = ({ author, id, content, title }: Blog) => {
  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "hi", label: "Hindi" },
    { code: "zh", label: "Chinese" },
  ];
  const [lang, setLang] = useState<string>("en");

  const [translate, setTranslate] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
  };

  const TextTranslation = async () => {
    const options = {
      method: "POST",
      url: "https://google-translate113.p.rapidapi.com/api/v1/translator/text",
      headers: {
        "x-rapidapi-key": "69557a82d5msh36e61ae654dd7dbp166605jsnafda6d249186",
        "x-rapidapi-host": "google-translate113.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        from: "auto",

        to: lang,
        text: content,
      },
    };

    try {
      const response = await axios.request(options);
      //  how to know the exact end point ??
      // console.log("data: " + response.data);
      console.log("data.trans: ", response.data.trans);

      setTranslate(response.data.trans);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };
  return (
    <div>
      <Appbar />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="max-w-5xl w-full bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
          <div className="md:flex">
            <div className="p-6 md:p-8">
              <div>
                <h1 className="block mt-1 text-lg leading-tight font-bold text-black hover:underline">
                  {title}
                </h1>
                <br />
                <div className=" grid grid-cols-2">
                  <div className="flex  items-center tracking-wide text-m text-gray-500 font-semibold ">
                    <Avatar name={author.name.toUpperCase()} /> &nbsp; &nbsp;by{" "}
                    {author.name}
                  </div>
                  <div className="flex justify-end">
                    <div>
                      <select value={lang} onChange={handleLanguageChange}>
                        {languages.map((langs) => (
                          <option key={langs.code} value={langs.code}>
                            {langs.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={TextTranslation}
                        disabled={isTranslating}
                        className="bg-blue-500 text-white p-1 rounded"
                      >
                        {isTranslating ? "Translating..." : "Translate"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-gray-500">{translate || content}</p>
            </div>
          </div>

          <div className="p-5 flex space-x-4">
            <BlogDelete blogId={id} />
            <BlogEdit blogId={id}></BlogEdit>
          </div>
        </div>
      </div>
    </div>
  );
};

// export function Avatar({ name }: { name: string }) {
//   return (
//     <div className="flex-shrink-0">
//       <span className="inline-block h-5 w-5 rounded-full overflow-hidden bg-gray-100">
//         <span className="text-sm font-medium leading-none text-gray-600 pl-2">
//           {name[0]}
//         </span>
//       </span>
//     </div>
//   );
// }
