import RegistrationForm from "./components/RegistrationForm";
import "./assets/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserList from "@components/UserList/UserList";
import "./i18n";
import type { FC } from "react";

export const queryClient = new QueryClient();

const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <main className="main">
      <RegistrationForm />
      <UserList />
    </main>
  </QueryClientProvider>
);

export default App;
