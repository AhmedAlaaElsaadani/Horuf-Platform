import React, { useEffect, useState } from "react";
import { Link, useLocation, useOutletContext, useParams } from "react-router-dom";
import ApiManager from "../../Utilies/ApiManager";
import style from "./Content.module.css";
import { useTranslation } from "react-i18next";

export default function Content() {
  let { unitID } = useParams();
  const location = useLocation();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {links,setLinks} = useOutletContext(); // Receiving data from parent
  const { t } = useTranslation();

  // get data from api
  const getData = async (unitID) => {
    setMessage("");
    setIsLoading(true);
    try {
      let { data } = await ApiManager.getLessons(unitID);
      setLessons(data);
      console.log(data);

      if (data.length === 0) {
        setMessage(t("No data available for lessons"));
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
    getData(unitID);
  }, []);
  return (
    <div className="row g-3 my-3 justify-content-center">

      {isLoading ? (
        [...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="col-sm-12 placeholder-glow "
          >    <div className={style["lesson"] + "  placeholder  w-100 my-3"}>
          <span
            className="mx-2 p-1"
          >
            {idx < 10 ? "0" + (idx + 1) : idx + 1}
          </span>
        </div></div>
        ))
      ) : message ? (
        <div className="col-12 text-center bg-primary p-3 fs-3 lead rounded-4">
          {message}
        </div>
      ) : (
        lessons.map((lesson, idx) => (
          <div key={idx} className={"col-sm-12 "}>
            <Link to={`/subjects/lessons/${lesson.id}`}>
              <div className={style["lesson"] + " my-3"} 
              >
                <span
                  className="mx-2 p-1"
                >
                  {idx < 10 ? "0" + (idx + 1) : idx + 1}
                </span>
                {lesson.title}
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
