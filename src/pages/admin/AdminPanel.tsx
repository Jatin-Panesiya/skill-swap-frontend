import { useState, useEffect } from "react";
import { Card, Avatar, Loader, Badge } from "@mantine/core";
import Button from "../../components/Button/Button";
import { toast } from "react-toastify";
import { getAllUsers, deleteUser } from "../../api/api";
import type { IUser } from "../../api/request.type";
import { getRandomColor } from "../../utils/common";
import { HiOutlineTrash, HiOutlineUser } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router";

const AdminPanel = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      const usersWithColor = response.data.map((user: IUser) => ({
        ...user,
        color: getRandomColor(),
      }));
      setUsers(usersWithColor);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeletingId(userId);
      await deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role?.toLowerCase() === "admin" || u.role === "ADMIN").length,
    regular: users.filter((u) => u.role?.toLowerCase() === "user" || u.role === "USER").length,
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-h1 font-bold mb-2" style={{ color: '#6366F1' }}>
          Admin Panel
        </h1>
        <p className="text-sm" style={{ color: '#475569' }}>Manage users and system settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#6366F1' }}>
              <FaUsers className="text-white text-2xl" />
            </div>
            <div>
              <div className="text-h2 font-bold" style={{ color: '#0F172A' }}>{stats.total}</div>
              <div className="text-sm" style={{ color: '#475569' }}>Total Users</div>
            </div>
          </div>
        </Card>

        <Card className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#9333EA' }}>
              <HiOutlineUser className="text-white text-2xl" />
            </div>
            <div>
              <div className="text-h2 font-bold" style={{ color: '#0F172A' }}>{stats.admins}</div>
              <div className="text-sm" style={{ color: '#475569' }}>Admins</div>
            </div>
          </div>
        </Card>

        <Card className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#14B8A6' }}>
              <HiOutlineUser className="text-white text-2xl" />
            </div>
            <div>
              <div className="text-h2 font-bold" style={{ color: '#0F172A' }}>{stats.regular}</div>
              <div className="text-sm" style={{ color: '#475569' }}>Regular Users</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2 font-bold" style={{ color: '#0F172A' }}>All Users</h2>
          <Button
            variant="primary"
            onClick={fetchUsers}
          >
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" style={{ color: '#6366F1' }} />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12" style={{ color: '#475569' }}>
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0F172A' }}>User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0F172A' }}>Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0F172A' }}>Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0F172A' }}>Skills</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0F172A' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    style={{ borderBottom: '1px solid #E2E8F0' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="py-4 px-4">
                      <Link
                        to={`/user-profile/${user._id}`}
                        className="flex items-center gap-3 transition-colors"
                        style={{ color: '#0F172A' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#6366F1'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#0F172A'}
                      >
                        <Avatar
                          size="sm"
                          style={{ backgroundColor: (user as any).color }}
                        >
                          <div className="text-white font-bold text-xs">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-sm" style={{ color: '#475569' }}>{user.email}</td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="light"
                        styles={{
                          root: {
                            backgroundColor: (user.role?.toLowerCase() === "admin" || user.role === "ADMIN") 
                              ? 'rgba(147, 51, 234, 0.1)' 
                              : 'rgba(99, 102, 241, 0.1)',
                            color: (user.role?.toLowerCase() === "admin" || user.role === "ADMIN") 
                              ? '#9333EA' 
                              : '#6366F1',
                            border: 'none',
                          },
                        }}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm" style={{ color: '#475569' }}>
                        {user.teachSkills?.length || 0} teaching, {user.learnSkills?.length || 0} learning
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user._id!)}
                        disabled={deletingId === user._id}
                        loading={deletingId === user._id}
                      >
                        <HiOutlineTrash size={16} className="mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminPanel;

