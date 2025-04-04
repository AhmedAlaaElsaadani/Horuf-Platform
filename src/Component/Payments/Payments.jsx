import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./Payments.module.css";
import Spinner from "../Ui/Spinner/Spinner";
import { authContext } from "../../Context/authContext";
import ApiManager from "../../Utilies/ApiManager";

export default function Payments() {
  const { t, i18n } = useTranslation();
  const { token } = useContext(authContext);
  const [paymentHistory, setPaymentHistory] = useState(null);

  const getPaymentHistory = async () => {
    try {
      const { data } = await ApiManager.getMyPayments(token);
      if (data.success) {
        setPaymentHistory(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPaymentHistory();
  }, []);

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 2:
        return t("payment.Visa-Mastercard");
      case 3:
        return t("payment.Fawry");
      case 4:
        return t("payment.MobileWallets");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(i18n.language, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return { statusText: "payment.pending", style: style.statusPending };
      case 2:
        return {
          statusText: "payment.completed",
          style: style.statusCompleted,
        };
      case 3:
        return {
          statusText: "payment.cancelled",
          style: style.statusCancelled,
        };
      case 4:
        return { statusText: "payment.failed", style: style.statusFailed };
      default:
        return "";
    }
  };

  return (
    <div className={`container my-2`}>
      <div className={`mx-md-3 ${style.content} rounded`}>
        <div className={style.scrollbar}>
          {paymentHistory ? (
            <>
              {paymentHistory.length !== 0 ? (
                <div className={style.table}>
                  <table >
                    <thead>
                      <tr className={`${style.tableH}`}>
                        <th>{t("payment.title")}</th>
                        <th>{t("payment.datePay")}</th>
                        <th>{t("payment.dateComplete")}</th>
                        <th>{t("payment.method")}</th>
                        <th>{t("payment.price")}</th>
                        <th>{t("payment.status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((order, index) => (
                        <tr key={index}>
                          <td>{order.planTitle}</td>
                          <td>{formatDate(order.created)}</td>
                          <td>{formatDate(order.lastUpdated)}</td>
                          <td>{getPaymentMethodText(order.paymentMethod)}</td>
                          <td>{order.totalPrice}</td>
                          <td>
                            <div
                              className={`${style.itemStatus} ${
                                getStatusClass(order.status).style
                              }`}
                            >
                              {t(getStatusClass(order.status).statusText)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-white p-3 rounded-5 bg-info">
                  <h3 className="text-center">{t("payment.noData")}</h3>
                </div>
              )}
            </>
          ) : (
            <Spinner sectionFlag={false} />
          )}
        </div>
      </div>
    </div>
  );
}
