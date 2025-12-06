import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth/useAuth";
import Header from "../header/Header";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "../Sidebar/Sidebar";
import Loader from "../Loader/Loader";

const ProtectedRoute = () => {
  const { loading, user } = useAuth();
  const [opened, { toggle }] = useDisclosure();

  if (loading) return <Loader />;

  return user ? (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <AppShell
        padding="md"
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: { base: 250, md: 250, lg: 250 },
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-md">
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

        <AppShell.Navbar className="bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-lg">
          <Sidebar />
        </AppShell.Navbar>

        <AppShell.Main w="100vw" className="p-6">
          <div className="container mx-auto max-w-7xl">
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
