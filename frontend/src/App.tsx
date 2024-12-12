import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blogs } from "./pages/Blogs";
import { Blog } from "./pages/Blog";
import { Publish } from "./pages/Publish";
import { UpdateBlog } from "./pages/UpdateBlog";
import { GenerativeAi } from "./pages/GenAi";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Blogs />}></Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          <Route path="/blog/:id" element={<Blog />} />

          <Route path="/blogs" element={<Blogs />} />

          <Route path="/publish" element={<Publish />} />
          <Route path="/update/:id" element={<UpdateBlog />} />
          <Route path="/geneartiveAi" element={<GenerativeAi />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
