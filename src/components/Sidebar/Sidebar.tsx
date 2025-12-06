import { AppShell, ScrollArea } from "@mantine/core";
import Button from "../Button/Button";
import { useState, useEffect } from "react";
import { IoIosLogOut } from "react-icons/io";
import { NavLink, useNavigate } from "react-router";
import PrimaryModal from "../PrimaryModal/PrimaryModal";
import { toast } from "react-toastify";
import { logoutUser, getAllConversations } from "../../api/api";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { HiShieldCheck } from "react-icons/hi";
import { HiOutlineUserAdd } from "react-icons/hi";
import { HiOutlineChat } from "react-icons/hi";
import { HiOutlineCalendar } from "react-icons/hi";
import useAuth from "../../hooks/useAuth/useAuth";
import { useSocket } from "../../hooks/useSocket/useSocket";

const getSidebarMenu = (isAdmin: boolean) => {
  const menu = [
    {
      link: "Dashboard",
      path: "/dashboard",
      Icon: MdDashboard,
    },
    {
      link: "Users",
      path: "/users",
      Icon: FaUsers,
    },
    {
      link: "Matches",
      path: "/matches",
      Icon: HiOutlineUserAdd,
    },
    {
      link: "Chat",
      path: "/chat",
      Icon: HiOutlineChat,
    },
    {
      link: "Bookings",
      path: "/bookings",
      Icon: HiOutlineCalendar,
    },
    {
      link: "Profile",
      path: "/profile",
      Icon: CgProfile,
    },
  ];

  if (isAdmin) {
    menu.push({
      link: "Admin Panel",
      path: "/admin",
      Icon: HiShieldCheck,
    });
  }

  return menu;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role === "ADMIN";
  const sidebarMenu = getSidebarMenu(isAdmin);

  const fetchUnreadCount = async () => {
    try {
      const response = await getAllConversations();
      const conversations = response.data.conversations || [];
      const totalUnread = conversations.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
      setUnreadCount(totalUnread);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = () => {
        fetchUnreadCount();
      };

      socket.on("receive_message", handleNewMessage);
      socket.on("message_sent", handleNewMessage);

      return () => {
        socket.off("receive_message", handleNewMessage);
        socket.off("message_sent", handleNewMessage);
      };
    }
  }, [socket]);

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
          <div className="text-h3 font-bold mb-1" style={{ color: '#6366F1' }}>
            Log out from Skill Swap?
          </div>
          <div className="text-sm mb-4" style={{ color: '#475569' }}>Are you sure you want to logout?</div>
          <div className="p-2 mt-3 flex gap-3">
            <Button 
              variant="danger"
              fullWidth 
              onClick={handleLogOut}
            >
              Yes, logout
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </PrimaryModal>
      <AppShell.Section grow my="md" component={ScrollArea} px="md">
        <div className="space-y-2 text-md">
          {sidebarMenu.map(({ path, Icon, link }, index) => {
            const isChatLink = path === "/chat";
            return (
              <NavLink
                to={path}
                key={index}
                className={({ isActive }) => 
                  `p-3 font-semibold block w-full rounded-lg transition-all duration-200 group relative ${
                    isActive ? 'text-white' : ''
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#6366F1' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                })}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Icon 
                      className="side-icon transition-colors duration-200" 
                      size={20}
                    />
                    {isChatLink && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="transition-colors duration-200">{link}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </AppShell.Section>
    </div>
  );
};

export default Sidebar;
