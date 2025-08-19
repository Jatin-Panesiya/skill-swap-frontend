import { useEffect, useState } from "react";
import { getLoggedInUser } from "../../api/api";
import { getLocalStorage, setLocalStorage } from "../../utils/common";
import type { IUser } from "../../types/common.type";

const useAuth = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const response = await getLoggedInUser();
        setUser(response.data.user);
        setLocalStorage("user", response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const localUser = getLocalStorage("user");

    if (localUser?._id) {
      setUser(localUser);
      setLoading(false);
    } else {
      getUser();
    }
  }, []);

  return { user, loading };
};

export default useAuth;
