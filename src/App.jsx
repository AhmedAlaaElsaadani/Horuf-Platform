import { useEffect } from "react";
import i18n from "./i18n";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoutLayout from "./Component/RoutLayout/RoutLayout";
import About from "./Component/About/About";
import Home from "./Component/Home/Home";
import { useTranslation } from "react-i18next";

/**
 * Api
 *      -login
 *      -register
 *      -forget password
 *      -update student profile
 *      -update student password
 *      -get student courses
 *      -get course units
 *      -get course content
 *      -get course video
 *      -get teachers
 *
 * contexts
 *      -AuthContext <Ahmed>
 * components
 *      -navbar <Ahmed> 80%
 *      -RoutLayout <Ahmed> 80%
 *      -Home <Ahmed> 100% ✅
 *      -student account
 *                . Edit student profile
 *                . Change password
 *                . Update Email
 *                . My courses
 *      -About <Mohamed> 80%
 *      -Contact <Mohamed>
 *      -Footer <Mohamed>
 *      -Login
 *      -Register
 *      -Forget password
 *      -Courses
 *                . Course units
 *                . Course content
 *                . Course video
 *      -Teachers
 *      -Heading1 <Ahmed> 90%
 *      -Heading2 <Ahmed> 90%
 */

function App() {
  const {t}=useTranslation();
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
              element: (
                <p> 
                  {t("about_mission")}
                </p>
              ),
            },
            {
              path: "ourMission",
              element: (
                <p>
                  {
                    t("about_mission")
                  }     </p>
              ),
            },
            {
              path: "ourVision",
              element: (
                <p>
                  {
                    t("about_vision")
                  }
                </p>
              ),
            },
  
            {
              path: "ourValues",
              element: (
                <p>
                  {
                    t("about_values")
                  }
                </p>
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
    const i18nextLng = "en";
    i18n.changeLanguage(i18nextLng);
    if (i18nextLng === "ar") document.body.dir = "rtl";
    else document.body.dir = "ltr";

    // that is a dark mode for the loading page before the app is loaded
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (mediaQuery.matches) {
      document.querySelector("body").classList.add("dark");
    }
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
