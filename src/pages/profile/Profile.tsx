import { useEffect, useState } from "react";
import type { IUser } from "../../api/request.type";
import { toast } from "react-toastify";
import { getUserById, sendMatchRequest, getSentRequests, getAcceptedMatches } from "../../api/api";
import { useNavigate, useParams } from "react-router";
import { IoArrowBackCircle } from "react-icons/io5";
import { Loader } from "@mantine/core";
import Button from "../../components/Button/Button";
import { HiOutlineUserAdd } from "react-icons/hi";
import useAuth from "../../hooks/useAuth/useAuth";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);
  const [sentRequest, setSentRequest] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
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
    checkSentRequest();
    checkAcceptedMatch();
  }, [id]);

  const checkSentRequest = async () => {
    try {
      const response = await getSentRequests();
      const hasSentRequest = (response.data.requests || []).some(
        (req: any) => req.recipient._id === id
      );
      setSentRequest(hasSentRequest);
    } catch (error) {
    }
  };

  const checkAcceptedMatch = async () => {
    try {
      const response = await getAcceptedMatches();
      const hasMatch = (response.data.matches || []).some(
        (match: any) => (match.user?._id || match.user) === id
      );
      setIsMatched(hasMatch);
    } catch (error) {
    }
  };

  const handleSendMatchRequest = async () => {
    if (!id) return;
    try {
      setSendingRequest(true);
      await sendMatchRequest(id);
      toast.success("Match request sent!");
      setSentRequest(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send match request");
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center cursor-pointer gap-2 text-base font-semibold transition duration-200 w-fit group"
          style={{ color: '#475569' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#6366F1'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
        >
          <IoArrowBackCircle size={24} className="group-hover:scale-110 transition-transform duration-200" />
          <span>Back</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center w-full py-12">
          <Loader size="lg" style={{ color: '#6366F1' }} />
        </div>
      ) : (
        <div className="card">
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-h1 font-bold mb-2" style={{ color: '#6366F1' }}>
                  {user?.name}
                </h1>
                {user?.email && (
                  <p style={{ color: '#475569' }}>{user.email}</p>
                )}
              </div>
              {id && id !== currentUser?._id && (
                <div>
                  {isMatched ? (
                    <span className="px-4 py-2 text-sm text-green-600 bg-green-100 rounded-lg">
                      Matched
                    </span>
                  ) : !sentRequest ? (
                    <Button
                      variant="primary"
                      onClick={handleSendMatchRequest}
                      loading={sendingRequest}
                    >
                      <HiOutlineUserAdd className="mr-1" size={16} />
                      Send Match Request
                    </Button>
                  ) : (
                    <span className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                      Request Sent
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {user?.teachSkills && user.teachSkills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-h3 font-semibold mb-3" style={{ color: '#0F172A' }}>Skills Offered</h2>
              <div className="flex flex-wrap gap-2">
                {user.teachSkills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 text-sm font-medium rounded-lg"
                    style={{ 
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: '#6366F1',
                      border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {user?.learnSkills && user.learnSkills.length > 0 && (
            <div>
              <h2 className="text-h3 font-semibold mb-3" style={{ color: '#0F172A' }}>Skills Learning</h2>
              <div className="flex flex-wrap gap-2">
                {user.learnSkills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 text-sm font-medium rounded-lg"
                    style={{ 
                      backgroundColor: 'rgba(20, 184, 166, 0.1)',
                      color: '#14B8A6',
                      border: '1px solid rgba(20, 184, 166, 0.2)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
