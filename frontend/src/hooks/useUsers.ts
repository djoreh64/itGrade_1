import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@constants";
import { queryClient } from "../App";

export interface IUser {
  id: number;
  login: string;
  fullName: string;
  email: string;
  phone: string;
  about: string;
  avatarUrl: string | null;
  createdAt: string;
}

interface IUserResponse {
  users: IUser[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
  };
}

export const useUsers = (offset: number, limit: number) =>
  useQuery<IUserResponse>({
    queryKey: ["users", offset, limit],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/users?offset=${offset}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Ошибка при загрузке пользователей");
      return res.json();
    },
  });

export const useUsersActions = () => {
  return {
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  };
};
