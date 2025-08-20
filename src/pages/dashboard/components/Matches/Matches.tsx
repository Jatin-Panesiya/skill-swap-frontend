import { Button, Card, Divider } from "@mantine/core";
import { useEffect, useState } from "react";
import { getActiveMatches } from "../../../../api/api";
import useAuth from "../../../../hooks/useAuth/useAuth";
import { toast } from "react-toastify";
import { type IUser } from "../../../../api/request.type";

const Matches = () => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<IUser[]>([]);
  const { user } = useAuth();

  const getMatches = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await getActiveMatches(user?._id);
      setMatches(response.data.matches);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMatches();
  }, [user]);

  return (
    <div>
      <Card>
        <div className="flex items-center justify-between">
          <div>Active Matches</div>
          <Button disabled={loading} loading={loading} onClick={getMatches}>
            Find Matches
          </Button>
        </div>
        <Divider className="my-3" />

        <div>
          {matches?.length === 0 ? (
            <div className="text-gray-500 text-sm">
              No Matches Found - Please try again
            </div>
          ) : (
            matches?.map((ele) => <div key={ele._id}>{ele.name}</div>)
          )}
        </div>
      </Card>
    </div>
  );
};

export default Matches;
