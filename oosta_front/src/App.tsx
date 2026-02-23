import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Products from "./ui/Product";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserPanel from "./pages/UserPanel";
import Cart from "./pages/Cart";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth, RedirectIfAuth } from "./Routes/RequireAuth";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>

        <BrowserRouter>
          <Routes>

            {/* AUTH PAGES — NO LAYOUT */}
            <Route path="signup" element={<RedirectIfAuth><Signup /></RedirectIfAuth>} />
            <Route path="login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />

            {/* MAIN APP WITH LAYOUT */}
            <Route path="/" element={<AppLayout/>}>
              <Route index element={<Navigate replace to="main"/>} />
              <Route path="main" element={<Main />} />
              <Route path="products" element={<Products/>} />
              <Route path="panel" element={<RequireAuth><UserPanel/></RequireAuth>} />
              <Route path="cart" element={<Cart/>} />
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;