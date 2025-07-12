import { useState } from "react";
import { useUsers } from "@hooks/useUsers";
import { BASE_URL } from "@constants";
import styles from "./UsersList.module.css";

const UserList = () => {
  const [page, setPage] = useState(0);
  const limit = 10;
  const offset = page * limit;

  const { data, isLoading, error } = useUsers(offset, limit);

  if (isLoading) return <p>Загрузка пользователей...</p>;
  if (error instanceof Error) return <p>Ошибка: {error.message}</p>;
  if (!data?.users.length) return;

  const totalPages = Math.ceil(data.pagination.total / limit);

  return (
    <div className={styles.userList}>
      <h2>Пользователи</h2>
      {data.users.map((user) => (
        <div key={user.id} className={styles.userCard}>
          <p>
            <b>Логин:</b> {user.login}
          </p>
          <p>
            <b>ФИО:</b> {user.fullName}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Телефон:</b> {user.phone}
          </p>
          <p>
            <b>О себе:</b> {user.about}
          </p>
          {user.avatarUrl && (
            <img
              src={`${BASE_URL}${user.avatarUrl}`}
              alt="Аватар"
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
        >
          {"<"}
        </button>

        <span>
          Страница {page + 1} из {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
          disabled={page + 1 >= totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default UserList;
