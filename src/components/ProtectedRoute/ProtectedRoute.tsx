import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth/useAuth";
import Header from "../header/Header";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "../Sidebar/Sidebar";

const ProtectedRoute = () => {
  const { loading, user } = useAuth();
  const [opened, { toggle }] = useDisclosure();

  if (loading) return <div>Loading...</div>;

  return user ? (
    <div className="bg-slate-100 flex min-h-[calc(100vh-76px)]">
      <AppShell
        padding="md"
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: { base: 250, md: 250, lg: 250 },
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Group h="100%" w="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Header />
          </Group>
        </AppShell.Header>

        <AppShell.Navbar>
          <Sidebar />
        </AppShell.Navbar>

        <AppShell.Main w="100vw">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </AppShell.Main>
      </AppShell>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
