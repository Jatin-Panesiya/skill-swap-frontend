import { AppShell, Button, ScrollArea } from "@mantine/core";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { NavLink, useNavigate } from "react-router";
import PrimaryModal from "../PrimaryModal/PrimaryModal";
import { toast } from "react-toastify";
import { logoutUser } from "../../api/api";
import { MdDashboard } from "react-icons/md";

const sidebarMenu = [
  {
    link: "Dashboard",
    path: "/dashboard",
    Icon: MdDashboard,
  },
  {
    link: "Profile",
    path: "/profile",
    Icon: CgProfile,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      toast.success("Logout successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response.data.message || "Logout failed");
    }
  };

  return (
    <div>
      <PrimaryModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
      >
        <div>
          <div className="font-bold">Log out from Skill Swap?</div>
          <div className="p-2 mt-3 flex gap-3">
            <Button color="red" fullWidth onClick={handleLogOut}>
              Yes, logout
            </Button>
            <Button
              fullWidth
              variant="outline"
              color="dark"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </PrimaryModal>
      <AppShell.Section grow my="md" component={ScrollArea} px="md">
        <div className="space-y-2 text-md">
          {sidebarMenu.map(({ path, Icon, link }, index) => (
            <NavLink
              className="p-1 font-semibold text-gray-500 block w-full"
              to={path}
              key={index}
            >
              <div className="flex items-center gap-3">
                <Icon className="side-icon" />
                {link}
              </div>
            </NavLink>
          ))}
        </div>
      </AppShell.Section>
      <AppShell.Section p="md">
        <button
          className="p-1 !font-bold cursor-pointer text-red-500 block w-full"
          onClick={() => {
            setDeleteModalOpen(true);
          }}
        >
          <div className="flex items-center gap-3">
            <IoIosLogOut className="side-icon" />
            Logout
          </div>
        </button>
      </AppShell.Section>
    </div>
  );
};

export default Sidebar;
