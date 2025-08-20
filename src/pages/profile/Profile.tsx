import { useEffect, useState } from "react";
import type { IUser } from "../../api/request.type";
import { toast } from "react-toastify";
import { getUserById } from "../../api/api";
import { useNavigate, useParams } from "react-router";
import { IoArrowBackCircle } from "react-icons/io5";
import { Loader } from "@mantine/core";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const response = await getUserById(id);

      setUser(response.data.user);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <div className="mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center cursor-pointer gap-3 text-lg text-black hover:text-primary transition duration-150 w-fit"
        >
          <IoArrowBackCircle size={25} />
          Back
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center w-full">
          <Loader color="blue" />
        </div>
      ) : (
        <>
          <div>{user?.name}</div>
        </>
      )}
    </div>
  );
};

export default Profile;
