import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, NotebookPen, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Appbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const handleLogout = () => {
    localStorage.clear(); // Remove JWT from localStorage
    alert("You have been logged out.");
    navigate("/signin"); // Redirect to sign-in page
  };
  // return (
  //   <div className="border-b border-slate-100 flex justify-between items-center p-4 md:px-16">
  //     <Link to={"/blogs"} className="text-xl font-bold">
  //       Medium
  //     </Link>
  //     <div>
  //       <Link to={`/publish`}>
  //         <button
  //           type="button"
  //           className="focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium flex items-center gap-2 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mx-12"
  //         >
  //           New
  //         </button>
  //       </Link>
  //       <Link to="/geneartiveAi">
  //         <button
  //           type="button"
  //           className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
  //         >
  //           Generate With AI
  //         </button>
  //       </Link>
  //       {token ? (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <button>
  //               <Avatar size={"big"} name="harkirat" />
  //             </button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent className="w-56">
  //             <DropdownMenuLabel>My Account</DropdownMenuLabel>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuGroup>
  //               <DropdownMenuItem>
  //                 <User />
  //                 <span>Profile</span>
  //                 <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
  //               </DropdownMenuItem>
  //               <DropdownMenuItem
  //                 onClick={() => {
  //                   handleLogout();
  //                 }}
  //               >
  //                 <LogOut />
  //                 <span>Log Out</span>
  //                 <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
  //               </DropdownMenuItem>
  //             </DropdownMenuGroup>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       ) : (
  //         <Link
  //           to="/signin"
  //           className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
  //         >
  //           Sign In
  //         </Link>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
    <div className="border-b border-slate-100 flex justify-between items-center p-4 md:px-16">
      <Link to="/" className="text-xl font-bold">
        Medium
      </Link>
      <div className="flex gap-4 md:gap-8">
        {token ? (
          <>
            <Link to="/publish">
              <button
                type="button"
                className="focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium flex items-center gap-2 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mx-12"
              >
                <NotebookPen /> Write
              </button>
            </Link>
            <Link to="/geneartiveAi">
              <button
                type="button"
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Generate With AI
              </button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar size={"big"} name={name as string} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User />
                    <span>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    <LogOut />
                    <span>Log Out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="border-b border-slate-100 flex justify-between items-center p-3 md:px-16">
            <div className="flex gap-2 md:gap-1">
              <div>
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                  onClick={() => {
                    alert("You are not Authorized , Please SignIn");
                  }}
                >
                  Generate With AI
                </button>
              </div>
              <div className="p-2">
                <Link
                  to="/signin"
                  className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
