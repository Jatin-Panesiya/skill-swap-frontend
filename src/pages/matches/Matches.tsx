import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAcceptedMatches,
  getPendingRequests,
  getSentRequests,
  acceptMatch,
  rejectMatch,
  withdrawMatchRequest,
  sendMatchRequest,
} from "../../api/api";
import type { IMatch, IUser } from "../../api/request.type";
import Button from "../../components/Button/Button";
import { HiOutlineUserAdd, HiOutlineCheck, HiOutlineX, HiOutlineTrash } from "react-icons/hi";
import { useNavigate } from "react-router";
import { Loader } from "@mantine/core";

const Matches = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"accepted" | "pending" | "sent">("accepted");
  const [acceptedMatches, setAcceptedMatches] = useState<IMatch[]>([]);
  const [pendingRequests, setPendingRequests] = useState<IMatch[]>([]);
  const [sentRequests, setSentRequests] = useState<IMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  const fetchAcceptedMatches = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const response = await getAcceptedMatches();
      const matches = (response.data.matches || []).map((match: any) => ({
        ...match,
        requester: match.user || match.requester,
        recipient: match.user || match.recipient,
      }));
      setAcceptedMatches(matches);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch accepted matches");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchPendingRequests = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const response = await getPendingRequests();
      setPendingRequests(response.data.requests || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch pending requests");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchSentRequests = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const response = await getSentRequests();
      setSentRequests(response.data.requests || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch sent requests");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([
          fetchAcceptedMatches(),
          fetchPendingRequests(),
          fetchSentRequests(),
        ]);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      if (activeTab === "accepted") {
        fetchAcceptedMatches(true);
      } else if (activeTab === "pending") {
        fetchPendingRequests(true);
      } else {
        fetchSentRequests(true);
      }
    }
  }, [activeTab]);

  const handleAcceptMatch = async (matchId: string) => {
    try {
      setActionLoading({ ...actionLoading, [`accept_${matchId}`]: true });
      await acceptMatch(matchId);
      toast.success("Match accepted!");
      await Promise.all([fetchPendingRequests(false), fetchAcceptedMatches(false)]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to accept match");
    } finally {
      setActionLoading({ ...actionLoading, [`accept_${matchId}`]: false });
    }
  };

  const handleRejectMatch = async (matchId: string) => {
    try {
      setActionLoading({ ...actionLoading, [`reject_${matchId}`]: true });
      await rejectMatch(matchId);
      toast.success("Match rejected");
      await fetchPendingRequests(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject match");
    } finally {
      setActionLoading({ ...actionLoading, [`reject_${matchId}`]: false });
    }
  };

  const handleWithdrawRequest = async (matchId: string) => {
    try {
      setActionLoading({ ...actionLoading, [`withdraw_${matchId}`]: true });
      await withdrawMatchRequest(matchId);
      toast.success("Match request withdrawn");
      await fetchSentRequests(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to withdraw request");
    } finally {
      setActionLoading({ ...actionLoading, [`withdraw_${matchId}`]: false });
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const renderMatchCard = (match: IMatch, showActions: boolean = false) => {
    let otherUser: IUser;
    if ('user' in match && (match as any).user) {
      otherUser = (match as any).user;
    } else if (activeTab === "pending") {
      otherUser = match.requester;
    } else {
      otherUser = match.recipient;
    }

    return (
      <div
        key={match._id}
        className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{otherUser.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{otherUser.email}</p>
            
            {otherUser.teachSkills && otherUser.teachSkills.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-700 mb-1">Teaching Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {otherUser.teachSkills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {match.isMutual && (
              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-2">
                Mutual Match
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleViewProfile(otherUser._id || "")}
            >
              View Profile
            </Button>
            {showActions && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAcceptMatch(match._id)}
                  loading={actionLoading[`accept_${match._id}`]}
                  disabled={actionLoading[`accept_${match._id}`] || actionLoading[`reject_${match._id}`]}
                >
                  <HiOutlineCheck className="mr-1" size={16} />
                  Accept
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRejectMatch(match._id)}
                  loading={actionLoading[`reject_${match._id}`]}
                  disabled={actionLoading[`accept_${match._id}`] || actionLoading[`reject_${match._id}`]}
                >
                  <HiOutlineX className="mr-1" size={16} />
                  Reject
                </Button>
              </>
            )}
            {activeTab === "sent" && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleWithdrawRequest(match._id)}
                loading={actionLoading[`withdraw_${match._id}`]}
                disabled={actionLoading[`withdraw_${match._id}`]}
              >
                <HiOutlineTrash className="mr-1" size={16} />
                Withdraw
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Matches</h1>
        <p className="text-gray-600">Manage your matches and requests</p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("accepted")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "accepted"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Accepted Matches ({acceptedMatches.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "pending"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "sent"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sent Requests ({sentRequests.length})
          </button>
        </div>
      </div>

      {(loading || initialLoading) ? (
        <div className="text-center py-12">
          <Loader size="md" style={{ color: '#6366F1' }} />
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === "accepted" && acceptedMatches.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No accepted matches yet</p>
            </div>
          )}
          {activeTab === "accepted" &&
            acceptedMatches.map((match) => renderMatchCard(match, false))}

          {activeTab === "pending" && pendingRequests.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No pending requests</p>
            </div>
          )}
          {activeTab === "pending" &&
            pendingRequests.map((match) => renderMatchCard(match, true))}

          {activeTab === "sent" && sentRequests.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No sent requests</p>
            </div>
          )}
          {activeTab === "sent" &&
            sentRequests.map((match) => renderMatchCard(match, false))}
        </div>
      )}
    </div>
  );
};

export default Matches;

