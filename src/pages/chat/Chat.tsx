import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  getAllConversations,
  getConversation,
  sendMessage as sendMessageAPI,
  getAcceptedMatches,
} from "../../api/api";
import { useSocket } from "../../hooks/useSocket/useSocket";
import type { IMessage, IUser, IMatch } from "../../api/request.type";
import Button from "../../components/Button/Button";
import useAuth from "../../hooks/useAuth/useAuth";
import { HiOutlineArrowLeft, HiOutlinePaperAirplane } from "react-icons/hi";

interface Conversation {
  user: IUser;
  lastMessage: IMessage;
  unreadCount: number;
}

const Chat = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [acceptedMatches, setAcceptedMatches] = useState<IUser[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);
  const { socket, connected, sendMessage: sendSocketMessage } = useSocket();

  useEffect(() => {
    fetchAcceptedMatches();
    
    if (socket && connected) {
      socket.emit("get_conversations");
    } else {
      const timeout = setTimeout(() => {
        if (!connected || !socket) {
          fetchConversations();
        } else {
          socket.emit("get_conversations");
        }
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [connected, socket]);

  useEffect(() => {
    if (!connected || !socket) {
      const pollInterval = setInterval(() => {
        if (selectedConversation) {
          fetchConversation(selectedConversation._id || "");
        }
        if (!isUserScrollingRef.current) {
          fetchConversations();
        }
      }, 10000);
      
      return () => clearInterval(pollInterval);
    }
  }, [selectedConversation, connected, socket]);

  useEffect(() => {
    if (userId) {
      if (socket && connected) {
        setLoading(true);
        socket.emit("get_conversation", { otherUserId: userId });
      } else {
        fetchConversation(userId);
      }
    } else {
      setSelectedConversation(null);
      setMessages([]);
    }
  }, [userId, socket, connected]);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message: IMessage) => {
        const currentUserId = selectedConversation?._id;
        const messageSenderId = message.sender?._id || message.sender;
        const messageReceiverId = message.receiver?._id || message.receiver;
        
        if (currentUserId && (
          messageSenderId === currentUserId ||
          messageReceiverId === currentUserId
        )) {
          setMessages((prev) => {
            const exists = prev.some((m) => m._id === message._id);
            if (exists) {
              return prev;
            }
            return [...prev, message];
          });
        }
      };

      const handleMessageSent = (message: IMessage) => {
        const currentUserId = selectedConversation?._id;
        const messageSenderId = message.sender?._id || message.sender;
        const messageReceiverId = message.receiver?._id || message.receiver;
        
        if (currentUserId && (
          messageSenderId === currentUserId ||
          messageReceiverId === currentUserId
        )) {
          setMessages((prev) => {
            const exists = prev.some((m) => m._id === message._id);
            if (exists) {
              return prev;
            }
            
            const filtered = prev.filter((m) => {
              if (!m._id?.startsWith("temp_")) {
                return true;
              }
              return m.content !== message.content;
            });
            
            return [...filtered, message];
          });
          shouldAutoScrollRef.current = true;
        }
      };

      const handleConversationUpdated = (data: { otherUserId: string; lastMessage: IMessage }) => {
        setConversations((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((c) => c.user._id === data.otherUserId);
          
          if (index >= 0) {
            updated[index] = {
              ...updated[index],
              lastMessage: data.lastMessage,
              unreadCount: data.otherUserId === selectedConversation?._id ? 0 : updated[index].unreadCount + 1,
            };
            updated.sort((a, b) => 
              new Date(b.lastMessage.createdAt || 0).getTime() - new Date(a.lastMessage.createdAt || 0).getTime()
            );
          } else {
            const newConv: Conversation = {
              user: data.lastMessage.sender._id === data.otherUserId ? data.lastMessage.sender : data.lastMessage.receiver,
              lastMessage: data.lastMessage,
              unreadCount: data.otherUserId === selectedConversation?._id ? 0 : 1,
            };
            updated.unshift(newConv);
          }
          
          return updated;
        });
      };

      const handleUserOnline = (data: { userId: string }) => {
        setOnlineUsers((prev) => new Set([...prev, data.userId]));
      };

      const handleUserOffline = (data: { userId: string }) => {
        setOnlineUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(data.userId);
          return updated;
        });
      };

      const handleConversationMessages = (data: { otherUserId: string; messages: IMessage[] }) => {
        setMessages(data.messages || []);
        setLoading(false);
        
        if (!selectedConversation && data.messages.length > 0) {
          const foundUser = data.messages[0].sender._id === data.otherUserId
            ? data.messages[0].sender
            : data.messages[0].receiver;
          setSelectedConversation(foundUser);
        } else if (selectedConversation?._id === data.otherUserId) {
        }
        
        setTimeout(() => {
          scrollToBottom(true);
        }, 300);
      };

      const handleConversationsList = (data: { conversations: Conversation[] }) => {
        setConversations(data.conversations || []);
      };

      socket.on("receive_message", handleReceiveMessage);
      socket.on("message_sent", handleMessageSent);
      socket.on("conversation_updated", handleConversationUpdated);
      socket.on("conversation_messages", handleConversationMessages);
      socket.on("conversations_list", handleConversationsList);
      socket.on("user_online", handleUserOnline);
      socket.on("user_offline", handleUserOffline);
      socket.on("error", (error) => {
        toast.error(error.message || "Socket connection error");
        setLoading(false);
      });

      return () => {
        socket.off("receive_message", handleReceiveMessage);
        socket.off("message_sent", handleMessageSent);
        socket.off("conversation_updated", handleConversationUpdated);
        socket.off("conversation_messages", handleConversationMessages);
        socket.off("conversations_list", handleConversationsList);
        socket.off("user_online", handleUserOnline);
        socket.off("user_offline", handleUserOffline);
        socket.off("error");
      };
    }
  }, [socket, selectedConversation]);

  const isNearBottom = () => {
    const container = chatContainerRef.current || document.getElementById("chat-messages-container");
    if (!container) return true;
    
    const threshold = 100;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom < threshold;
  };

  useEffect(() => {
    const container = chatContainerRef.current || document.getElementById("chat-messages-container");
    if (!container) return;

    const handleScroll = () => {
      isUserScrollingRef.current = true;
      shouldAutoScrollRef.current = isNearBottom();
      
      setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1000);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [selectedConversation]);

  useEffect(() => {
    if (messages.length > 0 && shouldAutoScrollRef.current && !isUserScrollingRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (shouldAutoScrollRef.current) {
            scrollToBottom();
          }
        }, 50);
      });
    }
  }, [messages.length]);

  useEffect(() => {
    if (selectedConversation) {
      shouldAutoScrollRef.current = true;
      setTimeout(() => {
        scrollToBottom(true);
      }, 300);
    }
  }, [selectedConversation?._id]);

  const scrollToBottom = (instant = false) => {
    if (!instant && isUserScrollingRef.current && !shouldAutoScrollRef.current) {
      return;
    }

    const container = chatContainerRef.current || document.getElementById("chat-messages-container");
    if (container) {
      if (instant) {
        container.scrollTop = container.scrollHeight;
      } else {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth"
        });
      }
    }
    
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: instant ? "auto" : "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  };

  const fetchConversations = async () => {
    if (connected && socket) {
      return;
    }
    try {
      const response = await getAllConversations();
      setConversations(response.data.conversations || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch conversations");
    }
  };

  const fetchAcceptedMatches = async () => {
    try {
      const response = await getAcceptedMatches();
      const matches = (response.data.matches || []).map((match: any) => {
        return match.user || match.requester || match.recipient;
      }).filter((user: IUser) => user && user._id);
      setAcceptedMatches(matches);
    } catch (error: any) {
    }
  };

  const fetchConversation = async (otherUserId: string) => {
    if (socket && connected) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await getConversation(otherUserId);
      const conversationMessages = response.data.messages || [];
      setMessages(conversationMessages);

      let foundUser: IUser | null = null;
      
      const conversation = conversations.find(
        (c) => c.user._id === otherUserId
      );
      if (conversation) {
        foundUser = conversation.user;
      } else if (conversationMessages.length > 0) {
        foundUser =
          conversationMessages[0].sender._id === otherUserId
            ? conversationMessages[0].sender
            : conversationMessages[0].receiver;
      } else {
        const match = acceptedMatches.find((m) => m._id === otherUserId);
        if (match) {
          foundUser = match;
        }
      }
      
      if (foundUser) {
        setSelectedConversation(foundUser);
      }

      setTimeout(() => {
        scrollToBottom(true);
      }, 300);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const content = messageInput.trim();
    setMessageInput("");

    try {
      if (connected && socket) {
        sendSocketMessage(selectedConversation._id || "", content);
        const optimisticMessage: IMessage = {
          _id: `temp_${Date.now()}`,
          sender: { _id: "", name: "", email: "" } as IUser,
          receiver: selectedConversation,
          content,
          read: false,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticMessage]);
      } else {
        const response = await sendMessageAPI(selectedConversation._id || "", content);
        if (response.data.message) {
          setMessages((prev) => [...prev, response.data.message]);
        }
        fetchConversations();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
      setMessages((prev) => prev.filter((m) => !m._id?.startsWith("temp_")));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex">
      <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {conversations.map((conv) => (
            <button
              key={conv.user._id}
              onClick={() => {
                navigate(`/chat/${conv.user._id}`);
                setSelectedConversation(conv.user);
              }}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                selectedConversation?._id === conv.user._id ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">
                      {conv.user.name}
                    </p>
                    {onlineUsers.has(conv.user._id || "") && (
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" title="Online"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage.content}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-indigo-600 text-white rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}

          {acceptedMatches
            .filter(
              (match) =>
                !conversations.some((conv) => conv.user._id === match._id)
            )
            .map((match) => (
              <button
                key={match._id}
                onClick={() => {
                  navigate(`/chat/${match._id}`);
                  setSelectedConversation(match);
                }}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedConversation?._id === match._id ? "bg-indigo-50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {match.name}
                    </p>
                    <p className="text-sm text-gray-400 truncate italic">
                      Start a conversation
                    </p>
                  </div>
                </div>
              </button>
            ))}

          {conversations.length === 0 && 
           acceptedMatches.filter(
             (match) =>
               !conversations.some((conv) => conv.user._id === match._id)
           ).length === 0 && (
            <div className="p-4 text-center text-gray-600">
              <p>No conversations yet</p>
              <p className="text-xs mt-1 text-gray-400">
                Accept a match to start chatting
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/chat")}
                >
                  <HiOutlineArrowLeft size={20} />
                </Button>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                  <p className="text-sm text-gray-600">{selectedConversation.email}</p>
                </div>
              </div>
            </div>

            <div 
              id="chat-messages-container"
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {loading ? (
                <div className="text-center text-gray-600">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-600">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((message) => {
                  const isSent = message.sender._id !== selectedConversation._id;
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isSent
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isSent ? "text-indigo-200" : "text-gray-600"
                          }`}
                        >
                          {new Date(message.createdAt || "").toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <HiOutlinePaperAirplane size={20} />
                  </Button>
                </div>
              </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Select a conversation</p>
              <p className="text-sm">Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Chat;

