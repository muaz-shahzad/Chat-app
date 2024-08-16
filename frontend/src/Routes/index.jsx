import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../Pages/Register";
import Home from "../Pages/Home";
import Message from "../Component/Message";
import Login from "../Pages/Login";
import ProtectedRoute from "../Routes/ProtectedRoute";
import Forget from "../Pages/ForgetPassword";
import NotFound from "../Pages/NotFound"; // Import the NotFound component
import ForgetEmailScreen from "../Component/ForgetEmailScreen";
import ForgetOTPScreen from "../Component/ForgetOTPScreen";
import ForgetUpdatePasswordScreen from "../Component/ForgetUpdatePasswordScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "login/forgetpassword/email",
        element: <ForgetEmailScreen  />,
      },
      {
        path: "login/forgetpassword/otp",
        element: <ForgetOTPScreen  />,
      },
      {
        path: "login/forgetpassword/updatepassword",
        element: <ForgetUpdatePasswordScreen/>,
      },

      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ":userId",
            element: <Message />,
          },
        ],
      },
      // Catch-all route for 404 Not Found
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
