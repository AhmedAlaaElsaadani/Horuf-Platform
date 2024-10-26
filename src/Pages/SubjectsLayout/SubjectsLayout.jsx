import React, { useState } from "react";
import Heading2 from "../../Component/Heading2/Heading2";
import img from "../../assets/Images/Heading2/1.jpeg";
import style from "./SubjectsLayout.module.css";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

export default function SubjectsLayout() {
  const { t } = useTranslation();
  const [links, setLinks] = useState([
    {
      to: "/subjects",
      text: t("subjects_heading"),
    },
  ]);
  return (
    <section
      id="Subjects"
      className={style.subjects}
      style={{
        minHeight: `calc(100vh - ${parseInt(
          window.getComputedStyle(document.body).paddingTop,
          10
        )}px)`,
      }}
    >
      <Heading2
        img={img}
        headingText={t("subjects_heading")}
        links={links}
        flagLinks={true}
        setLinks={setLinks}
      />
      <div className="container ">
        <Outlet
          context={{
            setLinks: setLinks,
            links: links,
          }}
        />
      </div>
    </section>
  );
}
