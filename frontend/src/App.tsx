import RegistrationForm from "./components/RegistrationForm";
import "./assets/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserList from "@components/UserList/UserList";
import "./i18n";

export const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RegistrationForm />
    <UserList />
  </QueryClientProvider>
);

export default App;
