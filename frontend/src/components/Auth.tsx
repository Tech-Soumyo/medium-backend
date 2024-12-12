import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { BACKEND_URL } from "../config";
import { signupInput, SignupInput } from "@devs-project/medium2-common";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const handleInputChange =
    (field: keyof SignupInput) => (e: ChangeEvent<HTMLInputElement>) => {
      setPostInputs((currentInput) => ({
        ...currentInput,
        [field]: e.target.value,
      }));
      setErrors((prev) => ({ ...prev, [field]: "" })); // Clear specific field error
    };
  async function sendRequest() {
    // Validate inputs before making the request
    const validation = signupInput.safeParse(postInputs);
    if (!validation.success) {
      // Extract error messages
      const fieldErrors: any = validation.error.formErrors.fieldErrors;
      setErrors({
        // email: fieldErrors.email?.[0],
        // password: fieldErrors.password?.[0],
        // Consider displaying all error messages from Zod validation instead of just the first one.
        email: fieldErrors.email?.join(", ") || "",
        password: fieldErrors.password?.join(", ") || "",
      });
      return;
    }

    try {
      // const response = await axios.post(
      //   `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
      //   postInputs,
      //   {
      //     headers: {
      //       "Content-Type": "application/json", // Ensure the server understands you're sending JSON
      //       "Content-Length": JSON.stringify(postInputs).length.toString(),
      //     },
      //     withCredentials: true,
      //   }
      // );
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      const jwt = response.data.jwt;
      const id = response.data.user.id;
      const username = response.data.user.name;
      if (jwt) {
        localStorage.setItem("token", jwt);
        localStorage.setItem("user", id);
        localStorage.setItem("name", username);

        navigate("/blogs");
      } else {
        console.error("No token received in response");
      }
    } catch (e) {
      console.error("Error while signing up:", e);
      setErrors({ email: "Failed to sign up, try again." });
    }
  }
  function parseJwt(token: string) {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  }
  async function demo() {
    const jwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlN2MyMjg5LWQzMDItNGYzMS04MTgyLTZmMjQwM3hmYWIzYSIsIm5hbWUiOiJzYW0iLCJlbWFpbCI6ImFxdWEzMUBnbWFpbC5jb20iLCJwYXNzd29yZCI6ImpXdEBQaXNzMjAjLCJ9.vkfUImyK1QSuN-NnL5W2IXpBwxNGKk9sVpgQl5o9nOA";
    const decodedJwt = parseJwt(jwtToken);
    const id = decodedJwt.id;
    const name = decodedJwt.name;
    const email = decodedJwt.email;
    const password = decodedJwt.password;
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", id);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    navigate("/blogs");
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">Create an account</div>
            <div className="text-slate-500">
              {type === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
              <Link
                className="pl-2 underline"
                to={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </div>
          <div className="pt-8">
            {type === "signup" ? (
              <LabelledInput
                label="Name"
                placeholder="Harkirat Singh..."
                // onChange={(e: ChangeEvent<HTMLInputElement>) => {
                //   setPostInputs((currentInput) => ({
                //     ...currentInput,
                //     name: e.target.value,
                //   }));
                // }}
                onChange={handleInputChange("name")}
              />
            ) : null}
            <LabelledInput
              label="Email"
              type="email"
              placeholder="harkirat@gmail.com"
              // onChange={(e: ChangeEvent<HTMLInputElement>) => {
              //   setPostInputs((currentInput) => ({
              //     ...currentInput,
              //     email: e.target.value,
              //   }));
              //   // @ts-ignore
              //   setErrors("");
              // }}
              onChange={handleInputChange("email")}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            <LabelledInput
              label="Password"
              type={"password"}
              placeholder="123456"
              // onChange={(e: ChangeEvent<HTMLInputElement>) => {
              //   setPostInputs((currentInput) => ({
              //     ...currentInput,
              //     password: e.target.value,
              //   }));
              //   // @ts-ignore
              //   setErrors("");
              // }}
              onChange={handleInputChange("password")}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}
            <div className="pt-5">
              <button
                onClick={sendRequest}
                type="button"
                className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                {type === "signup" ? "Sign up" : "Sign in"}
              </button>
            </div>
            <button
              type="button"
              className="w-full text-white bg-[#050708] hover:bg-[#050708]/90 
                            focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg 
                            text-sm px-5 py-2.5 text-center inline-flex items-center justify-center 
                            dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
              onClick={demo}
            >
              {" "}
              Login without credential
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}

// const { id, email, password } = decodedJwt;
// localStorage.setItem("userdata", JSON.stringify({ id, email, password }));
// const storedData = localStorage.getItem("userdata");
// if (storedData !== null) {
//   const parsedData = JSON.parse(storedData) as {
//     id: string;
//     email: string;
//     password: string;
//   };
//   console.log(parsedData);
// } else {
//   console.error("No userdata found in localStorage");
// }
// console.log(storedData);
