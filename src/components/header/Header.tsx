import { Link } from "react-router";
import { FaExchangeAlt } from "react-icons/fa";
import { Avatar, Menu } from "@mantine/core";
import Button from "../Button/Button";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router";
import PrimaryModal from "../PrimaryModal/PrimaryModal";
import { toast } from "react-toastify";
import { logoutUser } from "../../api/api";
import { HiChevronDown } from "react-icons/hi";
import useAuth from "../../hooks/useAuth/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const getUserColor = (userId?: string) => {
    if (!userId) return "#6366f1";
    const colors = [
      "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", 
      "#10b981", "#3b82f6", "#ef4444", "#14b8a6"
    ];
    const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  const userColor = getUserColor(user?._id);

  const handleLogOut = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      toast.success("Logout successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
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

      <div className="md:w-full w-[calc(100vw-100px)]">
        <div className="flex items-center w-full gap-5 justify-between">
          <Link 
            to="/dashboard" 
            className="cursor-pointer flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
          >
            <div className="p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300" style={{ backgroundColor: '#6366F1' }}>
              <FaExchangeAlt className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold" style={{ color: '#6366F1' }}>
              Skill Swap
            </span>
          </Link>

          {/* User Profile Menu */}
          {user && (
            <Menu
              shadow="lg"
              width={260}
              position="bottom-end"
              withArrow
              offset={8}
            >
              <Menu.Target>
                <button className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 group" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Avatar
                    size="sm"
                    style={{ backgroundColor: userColor }}
                    className="shadow-md ring-2 ring-white"
                  >
                    <div className="text-white font-bold text-xs">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </Avatar>
                  <div className="hidden md:block text-left min-w-0">
                    <div className="font-semibold text-sm truncate transition-colors duration-200 max-w-[120px]" style={{ color: '#0F172A' }} onMouseEnter={(e) => e.currentTarget.style.color = '#6366F1'} onMouseLeave={(e) => e.currentTarget.style.color = '#0F172A'}>
                      {user.name}
                    </div>
                  </div>
                  <HiChevronDown 
                    size={16} 
                    className="transition-colors duration-200 hidden md:block" 
                    style={{ color: '#94A3B8' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6366F1'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                  />
                </button>
              </Menu.Target>

              <Menu.Dropdown className="backdrop-blur-xl shadow-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <Menu.Label className="text-xs uppercase font-semibold" style={{ color: '#94A3B8' }}>
                  Account
                </Menu.Label>
                <div className="px-3 py-2 mb-1" style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <div className="font-semibold text-sm" style={{ color: '#0F172A' }}>
                    {user.name}
                  </div>
                  <div className="text-xs truncate" style={{ color: '#475569' }}>
                    {user.email}
                  </div>
                </div>
                <Menu.Item
                  component={Link}
                  to="/profile"
                  leftSection={<CgProfile size={18} />}
                  style={{ color: '#0F172A' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  View Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IoIosLogOut size={18} />}
                  onClick={() => setDeleteModalOpen(true)}
                  style={{ color: '#EF4444' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
