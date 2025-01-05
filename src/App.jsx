import React, { lazy, useEffect } from "react";
import i18n from "./i18n";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";
//Contexts
const IsThemeModeProvider = lazy(() => import("./Context/isThemeModeContext"));
const IsMobileProvider = lazy(() => import("./Context/isMobileContext"));
const AuthProvider = lazy(() => import("./Context/authContext"));

//Components
const RoutLayout = lazy(() => import("./Component/RoutLayout/RoutLayout"));
const About = lazy(() => import("./Pages/About/About"));
const Home = lazy(() => import("./Pages/Home/Home"));
const SubjectsLayout = lazy(() =>
  import("./Pages/SubjectsLayout/SubjectsLayout")
);
const Contact = lazy(() => import("./Pages/Contact/Contact"));
const Subjects = lazy(() => import("./Component/Subjects/Subjects"));
const Units = lazy(() => import("./Component/Units/Units"));
const Content = lazy(() => import("./Component/Content/Content"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Register = lazy(() => import("./Pages/Register/Register"));
const EmailConfirmOtp = lazy(() =>
  import("./Pages/EmailConfirmOtp/EmailConfirmOtp")
);
const ProtectedRoute = lazy(() =>
  import("./Component/ProtectedRoute/ProtectedRoute")
);
const InverseProtectedRoute = lazy(() =>
  import("./Component/InverseProtectedRoute/InverseProtectedRoute")
);
const ForgetPasswordEmail = lazy(() =>
  import("./Pages/ForgetPasswordEmail/ForgetPasswordEmail")
);
const ForgetPasswordConfirmOtp = lazy(() =>
  import("./Pages/ForgetPasswordConfirmOtp/ForgetPasswordConfirmOtp")
);
const ForgetPasswordResetPass = lazy(() =>
  import("./Pages/ForgetPasswordResetPass/ForgetPasswordResetPass")
);
const Profile = lazy(() => import("./Pages/Profile/Profile"));
const UpdatePassword = lazy(() =>
  import("./Component/UpdatePassword/UpdatePassword")
);
const UpdateEmail = lazy(() => import("./Component/UpdateEmail/UpdateEmail"));
const UpdateProfile = lazy(() =>
  import("./Component/UpdateProfile/UpdateProfile")
);
const Projector = lazy(() => import("./Component/Projector/Projector"));
const MyCourses = lazy(() => import("./Component/MyCourses/MyCourses"));
const Error404 = lazy(() => import("./Component/Error404/Error404"));
/**
 * @description
 *
 */
/**
 * 1) delete unused Css
 * 2) change default image
 * 3) Spinner Component Done ✅
 * 4) lazy loading Done ✅
 * 5) add 404 page
 * 6) SEO
 * 7) add favicon
 * 8) add meta tags
 * 9) add google analytics
 * 10) add sitemap
 * 12) lazy loading Done ✅
 *
 */
function App() {
  const { t } = useTranslation();
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        // <React.Suspense fallback={<HomeLoading />}>
        <RoutLayout />
        // </React.Suspense>
      ),
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
      errorElement: <Error404 />,
    },
  ]);
  useEffect(() => {
    // this code is for the language direction
    // const i18nextLng = localStorage.getItem("i18nextLng") || "ar";
    const i18nextLng = "ar";
    i18n.changeLanguage(i18nextLng);
    if (i18nextLng === "ar") document.body.dir = "rtl";
    else document.body.dir = "ltr";
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
