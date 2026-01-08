import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Products from "./ui/Product";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserPanel from "./pages/UserPanel";
import Cart from "./pages/Cart";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout/>}>
            <Route index element={<Navigate replace to="main"/>} />
            <Route path="main"  element={<Main />} />
            <Route path="products" element={<Products/>} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="panel" element={<UserPanel/>} />
            <Route path="cart" element={<Cart/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;