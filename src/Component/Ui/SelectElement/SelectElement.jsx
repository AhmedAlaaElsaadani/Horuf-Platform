import React, { useEffect, useMemo, useRef, useState } from "react";
import style from "./SelectElement.module.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
export default function SelectElement({
  options,
  translation,
  selectValue,
  selectName,
  //formik props
  onChange,
  changeValue,
  icon,
  error,
  touched,
  // when be more than one select in the same page
  idx = 0,
  // when you want to use search in select
  searchFlag = false,
}) {

  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Memoize filtered options to prevent unnecessary re-renders
  const filteredOptions = useMemo(() => {
    if (!searchFlag || !searchTerm.trim()) return options;
    return options.filter(option =>
      t(option.key).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchFlag, t]);

  // Get the currently selected option text - memoized
  const selectedText = useMemo(() => {
    if (!selectValue) return "";
    const selectedOption = options.find(opt => opt.value === selectValue);
    return selectedOption ? t(selectedOption.key) : "";
  }, [selectName, options, t]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchFlag && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 10);
    }
  }, [isOpen, searchFlag]);
  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          setIsOpen(false);
          break;
        case "Tab":
          if (!searchFlag) {
            setIsOpen(false);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, searchFlag]);

  // Reset search when closing dropdown
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Handle option selection
  const handleOptionSelect = (option) => {
    changeValue(option.value);
    setIsOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: idx * 0.1 }}
        ref={dropdownRef}
        className={style.selectContainer + " mb-3"}
      >
        {icon && (
          <label htmlFor={selectName}>
            <i className={`fa-solid ${icon}`}></i>
          </label>
        )}
        <div className={style.selectBox}>
          {/* Hidden actual select for formik integration */}
          <select
            id={selectName}
            name={selectName}
            selectValue={selectValue}
            onChange={onChange}
            style={{ display: "none" }}
            aria-hidden="true"
          >
            <option
              value=""
            >
              {t(translation)}
            </option>
            {options &&
              options.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {t(option.key)}
                </option>
              ))}
          </select>

          {/* Accessible custom dropdown */}
          <div
            className={`${style.customSelect} ${isOpen ? style.open : ""}`}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-labelledby={`${selectName}-label`}
          >
            <div
              className={style.selectedOption}
              onClick={toggleDropdown}
              data-placeholder={t(translation)}
              id={`${selectName}-label`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleDropdown();
                }
              }}
            >
              {selectedText || t(translation)}
            </div>

            {isOpen && (
              <div className={style.dropdownMenu}>
                {searchFlag && (
                  <div className={style.searchContainer}>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={`${t("Search")} ${t(translation).toLowerCase()}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={style.searchInput}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                <div className={style.optionsList} role="listbox">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                      <div
                        key={index}
                        className={` ${style.option} ${option.value === selectValue ? style.selected : ""
                          }`}
                        onClick={() => handleOptionSelect(option)}
                        role="option"
                        aria-selected={option.value === selectValue}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleOptionSelect(option);
                          }
                        }}
                      >
                        {t(option.key)}
                      </div>
                    ))
                  ) : (
                    <div className={style.noResults}>No results found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      {error && touched && (
        <div className="text-danger text-center">{error}</div>
      )}
    </>
  );
}
