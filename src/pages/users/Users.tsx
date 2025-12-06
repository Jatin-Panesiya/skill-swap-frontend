import { toast } from "react-toastify";
import { getUsers, sendMatchRequest, getSentRequests, getAcceptedMatches } from "../../api/api";
import { useEffect, useState } from "react";
import type { IUser } from "../../api/request.type";
import { Avatar, Loader, Select, TextInput } from "@mantine/core";
import { getRandomColor } from "../../utils/common";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router";
import Button from "../../components/Button/Button";
import { HiOutlineUserAdd } from "react-icons/hi";

interface IFilters {
  search?: string;
}

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filters, setFilters] = useState<IFilters>({});
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [sentRequestIds, setSentRequestIds] = useState<Set<string>>(new Set());
  const [acceptedMatchIds, setAcceptedMatchIds] = useState<Set<string>>(new Set());
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters as any);
      queryParams.append("filterKey", searchBy);

      const queryString = queryParams.toString();
      const response = await getUsers(queryString);

      const filteredUsers = response.data.filter((user: IUser) => 
        user.role?.toUpperCase() !== "ADMIN"
      );

      const usersWithColor = filteredUsers.map((user: IUser) => ({
        ...user,
        color: getRandomColor(),
      }));

      setUsers(usersWithColor);
    } catch (error: any) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchSentRequests();
    fetchAcceptedMatches();
  }, [filters]);

  const fetchSentRequests = async () => {
    try {
      const response = await getSentRequests();
      const requestIds = new Set(
        (response.data.requests || []).map((req: any) => req.recipient._id)
      );
      setSentRequestIds(requestIds);
    } catch (error: any) {
    }
  };

  const fetchAcceptedMatches = async () => {
    try {
      const response = await getAcceptedMatches();
      const matchIds = new Set(
        (response.data.matches || []).map((match: any) => match.user?._id || match.user)
      );
      setAcceptedMatchIds(matchIds);
    } catch (error: any) {
    }
  };

  const handleSendMatchRequest = async (userId: string) => {
    try {
      setSendingRequest(userId);
      await sendMatchRequest(userId);
      toast.success("Match request sent!");
      setSentRequestIds((prev) => new Set([...prev, userId]));
      fetchSentRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send match request");
    } finally {
      setSendingRequest(null);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newFilters = { ...filters };

      if (search.trim() === "") {
        delete newFilters.search;
      } else {
        newFilters.search = search;
      }

      setFilters(newFilters);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-h1 font-bold mb-2" style={{ color: '#6366F1' }}>
          Discover Users
        </h1>
        <p className="text-sm" style={{ color: '#475569' }}>Find and connect with other skill enthusiasts</p>
      </div>
      
      <div className="mb-6 grid 500:flex gap-3 500:gap-4 items-center">
        <TextInput
          placeholder={`Search users by ${searchBy}`}
          className="w-full"
          leftSection={<CiSearch size={18} />}
          onKeyDown={handleSearch}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          classNames={{
            input: "rounded-lg",
          }}
          styles={{
            input: {
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              '&:focus': {
                borderColor: '#6366F1',
                boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
              },
            },
          }}
        />
        <div className="flex items-center gap-3">
          <div className="text-sm text-nowrap font-medium" style={{ color: '#475569' }}>Search By</div>
          <Select
            placeholder="Search By"
            defaultValue="Name"
            data={["Name", "Skill"]}
            className="max-500:!w-full"
            onChange={(val) => setSearchBy(val?.toLowerCase() as string)}
            styles={{
              input: {
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
              },
            }}
          />
        </div>
      </div>
      
      <div>
        {loading ? (
          <div className="flex justify-center w-full py-12">
            <Loader size="lg" style={{ color: '#6366F1' }} />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 card">
            <div className="text-lg font-medium" style={{ color: '#475569' }}>No Users Found</div>
            <div className="text-sm mt-2" style={{ color: '#94A3B8' }}>Try adjusting your search criteria</div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((ele) => (
              <div 
                key={ele._id}
                className="card p-5 transition-all duration-300 transform hover:scale-[1.02]"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.08) 0 4px 12px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.04) 0 3px 6px';
                }}
              >
                <div className="flex items-start gap-4">
                  <div>
                    <Avatar 
                      size="lg"
                      style={{ backgroundColor: ele.color }}
                      className="shadow-md"
                    >
                      <div className="text-white font-bold text-lg"> {ele.name[0]}</div>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-bold text-lg truncate" style={{ color: '#0F172A' }}>{ele.name}</div>
                    </div>
                    <div className="mb-3">
                      {ele.teachSkills.length === 0 ? (
                        <div className="text-sm" style={{ color: '#94A3B8' }}>No skills listed</div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {ele.teachSkills.slice(0, 3).map((skill, idx) => (
                            <span 
                              key={idx}
                              className="px-2.5 py-1 text-xs font-medium rounded-full"
                              style={{ 
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                color: '#6366F1',
                                border: '1px solid rgba(99, 102, 241, 0.2)'
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                          {ele.teachSkills.length > 3 && (
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>
                              +{ele.teachSkills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Link
                        to={`/user-profile/${ele._id}`}
                        className="inline-block text-sm font-semibold transition-all duration-300"
                        style={{ color: '#6366F1' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#4F46E5'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#6366F1'}
                      >
                        View Profile →
                      </Link>
                      {!acceptedMatchIds.has(ele._id || "") && !sentRequestIds.has(ele._id || "") && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSendMatchRequest(ele._id || "")}
                          loading={sendingRequest === ele._id}
                        >
                          <HiOutlineUserAdd className="mr-1" size={16} />
                          Match
                        </Button>
                      )}
                      {acceptedMatchIds.has(ele._id || "") && (
                        <span className="text-xs text-green-600 px-2 py-1 bg-green-100 rounded">
                          Matched
                        </span>
                      )}
                      {!acceptedMatchIds.has(ele._id || "") && sentRequestIds.has(ele._id || "") && (
                        <span className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded">
                          Request Sent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
