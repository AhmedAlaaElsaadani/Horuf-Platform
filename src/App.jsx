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
const Content = lazy(() => import("./Pages/Content/Content"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));
const Packages = lazy(() => import("./Pages/Packages/Packages"));
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
const Payments = lazy(() => import("./Component/Payments/Payments"));
const UpdateProfile = lazy(() =>
  import("./Component/UpdateProfile/UpdateProfile")
);
const MyPackages = lazy(() => import("./Pages/MyPackages/MyPackages"));
// payments
const Pay = lazy(() => import("./Pages/Pay/Pay"));
// const Projector = lazy(() => import("./Component/Projector/Projector"));
const Error404 = lazy(() => import("./Component/Error404/Error404"));
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
          path: "/Packages",
          element: <Packages />,
        },
        {
          path: "/content/:packageId",
          element: (
            <ProtectedRoute>
              <Content />
            </ProtectedRoute>
          ),
        },
        {
          path: "/pay/:packageID",
          element: (
            // <ProtectedRoute>
              <Pay />
            // </ProtectedRoute>
          ),
       
        },
        {
          path: "/pay",
          element: <Pay />,
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
              element: <UpdateProfile />,
            },
            {
              path: "edit-email",
              element: <UpdateEmail />,
            },
            {
              path: "edit-password",
              element: <UpdatePassword />,
            },
            {
              path: "payments",
              element: <Payments />,
            },
          ],
        },
        {
          path: "/MyPackages",
          element: (
            <ProtectedRoute>
              <MyPackages />
            </ProtectedRoute>
          ),
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
