import { useState } from "react";
import { useUsers } from "@hooks/useUsers";
import { BASE_URL } from "@constants";
import styles from "./UsersList.module.css";
import { useTranslation } from "react-i18next";

const UserList = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const limit = 10;
  const offset = page * limit;

  const { data, isLoading, error } = useUsers(offset, limit);

  if (isLoading) return <p>{t("loadingUsers")}</p>;
  if (error instanceof Error)
    return (
      <p>
        {t("error")}: {error.message}
      </p>
    );
  if (!data?.users.length) return null;

  const totalPages = Math.ceil(data.pagination.total / limit);

  return (
    <div className={styles.userList}>
      <h2>{t("users")}</h2>
      {data.users.map((user) => (
        <div key={user.id} className={styles.userCard}>
          <p>
            <b>{t("login")}:</b> {user.login}
          </p>
          <p>
            <b>{t("fullName")}:</b> {user.fullName}
          </p>
          <p>
            <b>{t("email")}:</b> {user.email}
          </p>
          <p>
            <b>{t("phone")}:</b> {user.phone}
          </p>
          <p>
            <b>{t("about")}:</b> {user.about}
          </p>
          {user.avatarUrl && (
            <img
              src={`${BASE_URL}${user.avatarUrl}`}
              alt={t("avatar")}
              width={100}
              height={100}
            />
          )}
        </div>
      ))}

      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          aria-label={t("previousPage")}
        >
          {"<"}
        </button>

        <span>
          {t("page")} {page + 1} {t("of")} {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
          disabled={page + 1 >= totalPages}
          aria-label={t("nextPage")}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default UserList;
