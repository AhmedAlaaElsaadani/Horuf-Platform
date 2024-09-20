import React from "react";
import Heading1 from "../Heading1/Heading1";
import { useTranslation } from "react-i18next";
import style from "./About.module.css";

export default function About() {
  const { t } = useTranslation();
  return (
    <section id="About" className={style.About}>
      <Heading1 headingText={t("About us")} />
    </section>
  );
}
