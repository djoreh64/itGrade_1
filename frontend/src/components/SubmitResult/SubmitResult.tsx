import { type FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "@components/RegistrationForm/RegistrationForm.module.css";
import { BASE_URL } from "@constants";

interface Props {
  submitResult: {
    success: boolean;
    data?: any;
    errors?: Record<string, string>;
  };
}

const SubmitResult: FC<Props> = ({ submitResult }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.result} style={{ marginTop: 20 }}>
      <h2>{t("dataSuccessfullySent")}:</h2>
      <ul>
        <li>
          <b>{t("login")}:</b> {submitResult.data.login}
        </li>
        <li>
          <b>{t("password")}:</b> {submitResult.data.password}
        </li>
        <li>
          <b>{t("fullName")}:</b> {submitResult.data.fullName}
        </li>
        <li>
          <b>{t("email")}:</b> {submitResult.data.email}
        </li>
        <li>
          <b>{t("phone")}:</b> {submitResult.data.phone}
        </li>
        <li>
          <b>{t("about")}:</b> {submitResult.data.about}
        </li>
        {submitResult.data.avatarUrl ? (
          <li>
            <b>{t("avatar")}:</b>
            <br />
            <img
              src={BASE_URL + submitResult.data.avatarUrl}
              alt={t("avatar")}
              width={150}
              height={150}
            />
          </li>
        ) : (
          <li>
            <b>{t("avatar")}:</b> {t("notUploaded")}
          </li>
        )}
      </ul>
    </div>
  );
};

export default SubmitResult;
