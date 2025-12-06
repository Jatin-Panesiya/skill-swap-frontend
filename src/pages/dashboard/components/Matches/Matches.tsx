import { Card, Divider, Loader } from "@mantine/core";
import Button from "../../../../components/Button/Button";
import { useEffect, useState } from "react";
import { getActiveMatches, sendMatchRequest, getSentRequests, getAcceptedMatches } from "../../../../api/api";
import { toast } from "react-toastify";
import { type IUser } from "../../../../api/request.type";
import { HiOutlineUserAdd } from "react-icons/hi";

const Matches = () => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<IUser[]>([]);
  const [sentRequestIds, setSentRequestIds] = useState<Set<string>>(new Set());
  const [acceptedMatchIds, setAcceptedMatchIds] = useState<Set<string>>(new Set());
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);

  const getMatches = async () => {
    try {
      setLoading(true);
      const response = await getActiveMatches();
      const filteredMatches = response.data.matches.filter((user: IUser) => 
        user.role?.toUpperCase() !== "ADMIN"
      );
      setMatches(filteredMatches);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    getMatches();
    fetchSentRequests();
    fetchAcceptedMatches();
  }, []);

  return (
    <div>
      <Card className="card transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="text-h2 font-bold" style={{ color: '#6366F1' }}>
            Active Matches
          </div>
          <Button 
            variant="primary"
            loading={loading}
            onClick={getMatches}
          >
            Find <span className="max-340:hidden ps-1"> Matches</span>
          </Button>
        </div>
        <Divider className="my-4" style={{ borderColor: '#E2E8F0' }} />

        <div>
          {loading ? (
            <div className="text-center py-8">
              <Loader size="md" style={{ color: '#6366F1' }} />
              <p className="text-sm mt-2" style={{ color: '#475569' }}>Finding matches...</p>
            </div>
          ) : matches?.length === 0 ? (
            <div className="text-sm p-4 rounded-lg text-center" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E2E8F0', color: '#475569' }}>
              No Matches Found - Please try again
            </div>
          ) : (
            <div>
              <div className="text-sm pb-4 font-medium" style={{ color: '#475569' }}>
                Total {matches.length} {matches.length === 1 ? "user" : "users"}{" "}
                found
              </div>
              <div className="space-y-3">
                {matches?.map((ele) => (
                  <div 
                    key={ele._id} 
                    className="p-4 rounded-lg transition-all duration-200"
                    style={{ 
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.04) 0 3px 6px';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold" style={{ color: '#0F172A' }}>{ele.name}</div>
                        {ele.teachSkills && ele.teachSkills.length > 0 && (
                          <div className="text-xs mt-1" style={{ color: '#475569' }}>
                            Can teach: {ele.teachSkills.slice(0, 3).join(", ")}
                            {ele.teachSkills.length > 3 && "..."}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
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
                          <span className="text-xs text-green-600 px-3 py-1.5 bg-green-100 rounded-lg whitespace-nowrap">
                            Matched
                          </span>
                        )}
                        {!acceptedMatchIds.has(ele._id || "") && sentRequestIds.has(ele._id || "") && (
                          <span className="text-xs text-gray-600 px-3 py-1.5 bg-gray-100 rounded-lg whitespace-nowrap">
                            Request Sent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Matches;
