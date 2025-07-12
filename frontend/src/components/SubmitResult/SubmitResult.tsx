import { type FC } from "react";
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
  return (
    <div className={styles.result} style={{ marginTop: 20 }}>
      <h2>Данные успешно отправлены:</h2>
      <ul>
        <li>
          <b>Логин:</b> {submitResult.data.login}
        </li>
        <li>
          <b>Пароль:</b> {submitResult.data.password}
        </li>
        <li>
          <b>ФИО:</b> {submitResult.data.fullName}
        </li>
        <li>
          <b>Email:</b> {submitResult.data.email}
        </li>
        <li>
          <b>Телефон:</b> {submitResult.data.phone}
        </li>
        <li>
          <b>О себе:</b> {submitResult.data.about}
        </li>
        {submitResult.data.avatarUrl ? (
          <li>
            <b>Аватар:</b>
            <br />
            <img
              src={BASE_URL + submitResult.data.avatarUrl}
              alt="Аватар"
              width={150}
              height={150}
            />
          </li>
        ) : (
          <li>
            <b>Аватар:</b> не загружен
          </li>
        )}
      </ul>
    </div>
  );
};

export default SubmitResult;
