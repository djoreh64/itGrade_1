import { useUsers } from "@hooks/useUsers";
import { BASE_URL } from "@constants";
import styles from "./UsersList.module.css";

const UserList = () => {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <p>Загрузка пользователей...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;
  if (!users?.length) return null;

  return (
    <div className={styles.userList}>
      <h2>Пользователи</h2>
      {users?.map((user) => (
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
    </div>
  );
};

export default UserList;
