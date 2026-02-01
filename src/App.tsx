import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartProvider";
import { WishlistProvider } from "./context/wishlist-context";
import CartDrawer from "./components/store/CartDrawer";
import { useAuth } from "./hooks/useAuth";
import { AppRouter } from "./app/router";

const App: React.FC = () => {
  const { isAuthenticated, userRole, userName, login, logout } = useAuth();

  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "1.25rem",
                background: "#fff",
                color: "#111",
                fontWeight: "600",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              },
            }}
          />
          <CartDrawer />
          <AppRouter
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            userName={userName}
            login={login}
            logout={logout}
          />
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;
