// src/config/router.js

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "../screen/Dashboard";
import Login from "../screen/login/index";
import Register from "../screen/register";
import Profile from "../screen/Profile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/profile",
        element: <Profile />
    }
]);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;
