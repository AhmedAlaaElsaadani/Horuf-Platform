import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import img from "../../assets/Images/Heading2/1.jpeg";
import ApiManager from "../../Utilies/ApiManager";
import PackageCard from "../../Component/PackageCard/PackageCard";
import SelectElement from "../../Component/Ui/SelectElement/SelectElement";
import Heading2 from "../../Component/Heading2/Heading2";
import PackageDetails from "../../Component/PackageDetails/PackageDetails";
import { educationLevels } from "../../Utilies/data";
import { authContext } from "../../Context/authContext";
export default function Packages() {
  const [subjects, setSubjects] = useState([]);
  const { t } = useTranslation();
  const { token } = useContext(authContext);
  const [levelID, setLevelID] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [packages, setPackages] = useState([]);
  const [packageId, setPackageId] = useState(null);

  // get data from api
  const getSubject = async () => {
    setMessage("");
    setIsLoading(true);
    try {
      let { data } = await ApiManager.getSubjects();
      setSubjects(
        data.data.map((subject) => ({
          value: subject.id,
          key: subject.title,
        }))
      );
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  const getPackages = async () => {
    setMessage("");
    setIsLoading(true);
    try {
      let { data } = await ApiManager.getPackages(levelID, subjectID, token);
      if (data.success) {
        setPackages(data.data);
      }
      if (data.data.length === 0) {
        setMessage(t("No data available for packages"));
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getSubject();
  }, []);
  useEffect(() => {
    //get Date
    getPackages();
  }, [subjectID, levelID]);

  const selectElements = [
    {
      selectName: "subjects",
      options: subjects,
      translation: "subjects",
      selectValue: subjectID,
      onChange: (e) => setSubjectID(e.target.value),
      changeValue: (value) => setSubjectID(value),
      icon: "fa-book",
    },
    {
      selectName: "level",
      options: educationLevels,
      translation: "level",
      selectValue: levelID,
      onChange: (e) => setLevelID(e.target.value),
      changeValue: (value) => setLevelID(value),
      icon: "fa-school",
    },
  ];
  return (
    <section
      id="Packages"
      style={{
        minHeight: `calc(100vh - ${parseInt(
          window.getComputedStyle(document.body).paddingTop,
          10
        )}px)`,
      }}
    >
      <Heading2 img={img} headingText={t("Packages")} />
      <div className="container ">
        <div className="row g-3 my-3 justify-content-center">
          {selectElements.map((selectElement, idx) => (
            <div className="col-md-6" key={idx}>
              <SelectElement
                {...selectElement}
                idx={idx}
                icon={selectElement.icon}
              />
            </div>
          ))}
        </div>
        <div className="row g-3 my-3 justify-content-center">
          {isLoading ? (
            [1, 2, 3].map((_, idx) => (
              <PackageLoadingCard key={idx} idx={idx} t={t} />
            ))
          ) : message ? (
            <div className="col-12 text-center bg-primary text-white p-3 fs-3 lead rounded-4">
              {message}
            </div>
          ) : (
            packages.map((packageObject, idx) => (
              <PackageCard
                key={idx}
                packageObject={packageObject}
                idx={idx}
                setPackageId={setPackageId}
              />
            ))
          )}
        </div>
      </div>
      {packageId && (
        <PackageDetails
          packageId={packageId}
          closeModal={() => setPackageId(null)}
        />
      )}
    </section>
  );
}

const PackageLoadingCard = ({ idx, t }) => {
  return (
    <div key={idx} className="col-sm-12 col-lg-4  placeholder-glow col-md-6 ">
      <div
        className={"card position-relative w-100 placeholder "}
        style={{
          borderRadius: "0.9375rem",
          height: "300px",
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <div
          className="card-img-top"
          style={{
            filter: "blur(10px)",
            height: "300px",
            backgroundColor: "#3482ba",
          }}
        />
        <div className={"card-body w-100 position-absolute bottom-0 text-white "}>
          <h5 className="card-title ">{t("Loading...")}</h5>
        </div>
      </div>
    </div>
  );
};
