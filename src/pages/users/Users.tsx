import { toast } from "react-toastify";
import { getUsers } from "../../api/api";
import { useEffect, useState } from "react";
import type { IUser } from "../../api/request.type";
import { Avatar, Select, TextInput } from "@mantine/core";
import { getRandomColor } from "../../utils/common";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router";

interface IFilters {
  search?: string;
}

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filters, setFilters] = useState<IFilters>({});
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  const fetchAllUsers = async () => {
    try {
      const queryParams = new URLSearchParams(filters as any);
      queryParams.append("filterKey", searchBy);

      const queryString = queryParams.toString();
      const response = await getUsers(queryString);

      const usersWithColor = response.data.map((user: IUser) => ({
        ...user,
        color: getRandomColor(),
      }));

      setUsers(usersWithColor);
    } catch (error: any) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [filters]);

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
      <div className="mb-5 flex gap-5 items-center">
        <TextInput
          placeholder={`Search users by ${searchBy}`}
          className="w-full"
          leftSection={<CiSearch size={16} />}
          onKeyDown={handleSearch}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div className="text-sm text-gray-500 text-nowrap">Search By</div>
        <Select
          placeholder="Search By"
          defaultValue="Name"
          data={["Name", "Skill"]}
          onChange={(val) => setSearchBy(val?.toLowerCase() as string)}
        />
      </div>
      <div>
        {users.length === 0 ? (
          <div className="text-gray-500 text-sm">No Users Found</div>
        ) : (
          users.map((ele) => (
            <div className="flex items-center gap-3">
              <div>
                <Avatar style={{ backgroundColor: ele.color }}>
                  <div className="text-white"> {ele.name[0]}</div>
                </Avatar>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <div>{ele.name}</div> |
                  <Link to="/" className="text-primary text-sm">
                    View Profile
                  </Link>
                </div>
                <div className="flex gap-2 text-[13px] text-gray-500">
                  <div>Skills : </div>
                  <div>{ele.teachSkills.map((ele) => ele).join(", ")}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
