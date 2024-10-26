import { useEffect, useState } from "react";
import i18n from "./i18n";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoutLayout from "./Component/RoutLayout/RoutLayout";
import About from "./Pages/About/About";
import Home from "./Pages/Home/Home";
import { useTranslation } from "react-i18next";
import AuthProvider from "./Context/authContext";
import SubjectsLayout from "./Pages/SubjectsLayout/SubjectsLayout";
import Contact from "./Pages/Contact/Contact";
import Subjects from "./Component/Subjects/Subjects";
import Units from "./Component/Units/Units";
import Content from "./Component/Content/Content";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import EmailConfirmOtp from "./Pages/EmailConfirmOtp/EmailConfirmOtp";
import ProtectedRoute from "./Component/ProtectedRoute/ProtectedRoute";
import InverseProtectedRoute from "./Component/InverseProtectedRoute/InverseProtectedRoute";
import ForgetPasswordEmail from "./Pages/ForgetPasswordEmail/ForgetPasswordEmail";
import ForgetPasswordConfirmOtp from "./Pages/ForgetPasswordConfirmOtp/ForgetPasswordConfirmOtp";
import ForgetPasswordResetPass from "./Pages/ForgetPasswordResetPass/ForgetPasswordResetPass";
import Profile from "./Pages/Profile/Profile";
import UpdatePassword from "./Component/UpdatePassword/UpdatePassword";
import UpdateEmail from "./Component/UpdateEmail/UpdateEmail";
import UpdateProfile from "./Component/UpdateProfile/UpdateProfile";
import Projector from "./Component/Projector/Projector";
import MyCourses from "./Component/MyCourses/MyCourses";
import IsMobileProvider from "./Context/isMobileContext";
import IsThemeModeProvider from "./Context/isThemeModeContext";

/**
 * Api
 *      -login <Ahmed> 100% ✅ (T)
 *      -register <Ahmed> 100% ✅ (T)
 *      -forget password
 *      -update student profile
 *      -update student password
 *      -get student courses
 *      -get course units
 *      -get course content
 *      -get course video
 *      -get teachers
 *      -Contact
 *
 * contexts
 *      -AuthContext <Ahmed> 100% ✅ (T)
 * components
 *      - spinner
 *      - loading in first
 *      -navbar <Ahmed> 80%
 *      -RoutLayout <Ahmed> 80%
 *      -Home <Ahmed> 100% ✅ (T)
 *      -student account
 *                . Edit student profile
 *                . Change password
 *                . Update Email
 *                . My courses
 *      -About <Mohamed , Ahmed > 100% ✅
 *      -Contact
 *      -Footer
 *      -Login 80% (T)
 *      -Register 80% (T)
 *      -Forget password
 *      -Subjects <Ahmed>
 *                . Course units
 *                . Course content
 *                . Course video
 *      -Heading1 <Ahmed> 100% ✅
 *      -Heading2 <Ahmed> 100% ✅
 */

function App() {
  const { t } = useTranslation();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RoutLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
          children: [
            {
              index: true,
              element: <p>{t("about_mission")}</p>,
            },
            {
              path: "ourMission",
              element: <p>{t("about_mission")} </p>,
            },
            {
              path: "ourVision",
              element: <p>{t("about_vision")}</p>,
            },

            {
              path: "ourValues",
              element: <p>{t("about_values")}</p>,
            },
          ],
        },
        {
          path: "/subjects",
          element: <SubjectsLayout />,
          children: [
            {
              path: "",
              element: <Subjects />,
            },
            {
              path: "units/:subjectID",
              element: <Units />,
            },
            {
              path: "content/:unitID",
              element: <Content />,
            },
            {
              path: "lessons/:lessonID",
              element: (
                <ProtectedRoute>
                  <Projector />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/login",
          element: (
            <InverseProtectedRoute>
              <Login />
            </InverseProtectedRoute>
          ),
        },
        {
          path: "/register",
          element: (
            <InverseProtectedRoute>
              <Register />
            </InverseProtectedRoute>
          ),
        },
        {
          path: "/forget-password-email",
          element: (
            <InverseProtectedRoute>
              <ForgetPasswordEmail />
            </InverseProtectedRoute>
          ),
        },
        {
          path: "/forget-password-otp",
          element: (
            <InverseProtectedRoute>
              <ForgetPasswordConfirmOtp />
            </InverseProtectedRoute>
          ),
        },
        {
          path: "/forget-password-reset",
          element: (
            <InverseProtectedRoute>
              <ForgetPasswordResetPass />
            </InverseProtectedRoute>
          ),
        },
        {
          path: "/EmailConfirmOtp",
          element: <EmailConfirmOtp />,
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "",
              element: (
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              ),
            },
            {
              path: "edit-email",
              element: (
                <ProtectedRoute>
                  <UpdateEmail />
                </ProtectedRoute>
              ),
            },
            {
              path: "edit-password",
              element: (
                <ProtectedRoute>
                  <UpdatePassword />
                </ProtectedRoute>
              ),
            },
            {
              path: "my-courses",
              element: (
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);
  useEffect(() => {
    // this code is for the language direction
    // const i18nextLng = localStorage.getItem("i18nextLng") || "ar";
    const i18nextLng = "ar";
    i18n.changeLanguage(i18nextLng);
    if (i18nextLng === "ar") {
      document.body.dir = "rtl";
      document.title = "منصة حروف التعليمبة";
    } else {
      document.body.dir = "ltr";
      document.title = "Horuf Education Platform";
    }
  }, []);

  return (
    <>
      <IsThemeModeProvider>
        <IsMobileProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </IsMobileProvider>
      </IsThemeModeProvider>
    </>
  );
}

export default App;
