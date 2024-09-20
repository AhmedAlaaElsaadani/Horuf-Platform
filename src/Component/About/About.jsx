import React from "react";
import Heading1 from "../Heading1/Heading1";
import { useTranslation } from "react-i18next";

export default function About() {
    const {t} = useTranslation();
  return <section id="About">
    <Heading1 headingText={t("About us")} />
  </section>;
}
