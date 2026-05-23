import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home       from "./pages/Home.jsx";
import Difficulty from "./pages/Difficulty.jsx";
import Test       from "./pages/Test.jsx";
import Result     from "./pages/Result.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/difficulty" element={<Difficulty />} />
        <Route path="/test"       element={<Test />} />
        <Route path="/result"     element={<Result />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
