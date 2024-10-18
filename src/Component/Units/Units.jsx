import React, { useContext, useEffect, useState } from "react";
import style from "./Units.module.css";
import {
  Link,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import erorrImage from "../../assets/Images/Subjects/unit.jpg";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { authContext } from "../../Context/authContext";
export default function Units() {
  let { subjectID } = useParams();
  const location = useLocation();
  const [Units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { isRegistered } = useContext(authContext);
  const { t } = useTranslation();
  const { links, setLinks } = useOutletContext(); // Receiving data from parent

  // get data from api
  const getData = async (subjectID) => {
    setMessage("");
    setIsLoading(true);
    try {
      let { data } = await ApiManager.getUnits(subjectID);
      setUnits(data);

      if (data.length === 0) {
        setMessage(t("No data available for units"));
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.state) {
      const { links } = location.state;
      setLinks([...links]);
    }
    getData(subjectID);
  }, []);
  return (
    <div className="row g-3 my-3 justify-content-center">
      {isLoading ? (
        [...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="col-sm-12 placeholder-glow  col-lg-4 col-md-6"
          >
            <div class={"card  w-100 " + style["card"]}>
              <div
                className=" placeholder"
                style={{
                  filter: "blur(10px)",
                  height: "300px",
                  backgroundColor: "#3482ba",
                }}
              ></div>
              <div className={"card-body " + style["card-heading"]}>
                <h5 className="card-title">{t("Loading...")}</h5>
              </div>
            </div>
          </div>
        ))
      ) : message ? (
        <div className="col-12 text-center bg-primary p-3 fs-3 lead rounded-4">
          {message}
        </div>
      ) : (
        Units.map((unit, idx) => (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1 * idx > 2 ? 0.1 * idx : 0.1,
            }}
            key={idx}
            className="col-sm-12 col-lg-4 col-md-6"
          >
            <Link
              to={isRegistered ? `/subjects/content/${unit.id}` : "/login"}
              state={{
                links: [
                  ...links.slice(0, 2),
                  { to: `/subjects/content/${unit.id}`, text: unit.title },
                ],
              }}
            >
              <div class={"card " + style["card"]}>
                <img
                  src={unit.imageUrl ? unit.imageUrl : ""}
                  className="card-img-top"
                  alt="subject image "
                  onError={(e) => (e.target.src = erorrImage)}
                  loading="lazy"
                />{" "}
                <div className={"card-body " + style["card-heading"]}>
                  <h5 className="card-title">{unit.title}</h5>
                </div>
              </div>
            </Link>
          </motion.div>
        ))
      )}
    </div>
  );
}
