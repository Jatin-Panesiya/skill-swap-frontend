import { Avatar, Button, Menu } from "@mantine/core";
import { Link, useNavigate } from "react-router";
import { logoutUser } from "../../api/api";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth/useAuth";
import { IoIosLogOut } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import PrimaryModal from "../PrimaryModal/PrimaryModal";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);

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
            <Button fullWidth onClick={handleLogOut}>
              Yes, logout
            </Button>
            <Button
              fullWidth
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </PrimaryModal>
      <div className="flex items-center shadow-lg fixed top-0 z-10 bg-slate-100 w-full gap-5 p-5 justify-between">
        <Link to="/dashboard" className="cursor-pointer text-2xl font-bold">
          Skill Swap
        </Link>
        <div>
          <Menu
            opened={menuOpened}
            onChange={setMenuOpened}
            shadow="md"
            width={250}
          >
            <Menu.Target>
              <Avatar className="cursor-pointer" color="blue" radius="xl">
                {user?.name?.[0]}
              </Avatar>
            </Menu.Target>

            <Menu.Dropdown>
              <div className="p-2 space-y-2">
                <Button
                  fullWidth
                  onClick={() => {
                    setMenuOpened(false);
                    navigate("/profile");
                  }}
                  leftSection={<CiSettings />}
                >
                  Manage Profile
                </Button>
                <Button
                  fullWidth
                  leftSection={<IoIosLogOut />}
                  variant="outline"
                  onClick={() => {
                    setMenuOpened(false);
                    setDeleteModalOpen(true);
                  }}
                >
                  Logout
                </Button>
              </div>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
