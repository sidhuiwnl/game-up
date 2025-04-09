import {Routes,Route} from "react-router";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "@/pages/SignupPage.tsx";

function App() {


  return (
    <Routes>
        <Route path={"/login"} element={<LoginPage/>} />
        <Route path={"/register"} element={<SignupPage/>} />
    </Routes>
  )
}

export default App
