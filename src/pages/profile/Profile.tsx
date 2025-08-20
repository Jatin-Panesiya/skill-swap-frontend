import { useEffect, useState } from "react";
import type { IUser } from "../../api/request.type";
import { toast } from "react-toastify";
import { getUserById } from "../../api/api";
<<<<<<< HEAD
import { useNavigate, useParams } from "react-router";
import { IoArrowBackCircle } from "react-icons/io5";
import { Loader } from "@mantine/core";
=======
import { Link, useNavigate, useParams } from "react-router";
import { IoArrowBackCircle } from "react-icons/io5";
>>>>>>> 9ba4992916c0f3e72f4a3337b70fc55bf228e8da

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<IUser>();
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
=======
>>>>>>> 9ba4992916c0f3e72f4a3337b70fc55bf228e8da
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      if (!id) return;
<<<<<<< HEAD
      setLoading(true);
=======
>>>>>>> 9ba4992916c0f3e72f4a3337b70fc55bf228e8da
      const response = await getUserById(id);

      setUser(response.data.user);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
<<<<<<< HEAD
    } finally {
      setLoading(false);
=======
>>>>>>> 9ba4992916c0f3e72f4a3337b70fc55bf228e8da
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
<<<<<<< HEAD

      {loading ? (
        <div className="flex justify-center w-full">
          <Loader color="blue" />
        </div>
      ) : (
        <>
          <div>{user?.name}</div>
        </>
      )}
=======
      <div>{user?.name}</div>
>>>>>>> 9ba4992916c0f3e72f4a3337b70fc55bf228e8da
    </div>
  );
};

export default Profile;
