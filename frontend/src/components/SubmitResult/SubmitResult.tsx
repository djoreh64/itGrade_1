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
  const { login, password, fullName, email, phone, about, avatarUrl } =
    submitResult.data.user;

  return (
    <div className={styles.result}>
      <h2>{t("dataSuccessfullySent")}:</h2>
      <ul>
        <li>
          <b>{t("login")}:</b> {login}
        </li>
        <li>
          <b>{t("password")}:</b> {password}
        </li>
        <li>
          <b>{t("fullName")}:</b> {fullName}
        </li>
        <li>
          <b>{t("email")}:</b> {email}
        </li>
        <li>
          <b>{t("phone")}:</b> {phone}
        </li>
        <li>
          <b>{t("about")}:</b> {about}
        </li>
        {avatarUrl ? (
          <li>
            <b>{t("avatar")}:</b>
            <br />
            <img
              src={BASE_URL + avatarUrl}
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
