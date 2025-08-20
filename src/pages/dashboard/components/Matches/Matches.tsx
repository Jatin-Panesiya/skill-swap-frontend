import { Button, Card, Divider } from "@mantine/core";
import { useEffect, useState } from "react";
import { getActiveMatches } from "../../../../api/api";
import { toast } from "react-toastify";
import { type IUser } from "../../../../api/request.type";

const Matches = () => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<IUser[]>([]);

  const getMatches = async () => {
    try {
      setLoading(true);
      const response = await getActiveMatches();
      setMatches(response.data.matches);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMatches();
  }, []);

  return (
    <div>
      <Card>
        <div className="flex items-center justify-between">
          <div>Active Matches</div>
          <Button disabled={loading} loading={loading} onClick={getMatches}>
            Find <span className="max-340:hidden ps-1"> Matches</span>
          </Button>
        </div>
        <Divider className="my-3" />

        <div>
          {matches?.length === 0 ? (
            <div className="text-gray-500 text-sm">
              No Matches Found - Please try again
            </div>
          ) : (
            <div>
              <div className="text-gray-500 text-sm pb-3">
                Total {matches.length} {matches.length === 1 ? "user" : "users"}{" "}
                found
              </div>
              {matches?.map((ele) => (
                <div key={ele._id}>{ele.name}</div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Matches;
