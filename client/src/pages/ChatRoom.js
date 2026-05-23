import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./stylesheets/ChatRoom.css";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { deleteToken, getUserFromToken } from "../utils/token";
import { DEMO_MODE } from "../utils/demo";
import { FAKE_FRIEND_DETAILS, CHAT_SCRIPTS } from "../demo/fakeData";

const socket = DEMO_MODE ? null : io("https://node.me2vegan.com");

const ChatRoom = ({ userId, friendId, showMessage }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [friend, setFriend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Demo 模式：訊息選項
  const [chatRound, setChatRound] = useState(0);
  const [chatLocked, setChatLocked] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (DEMO_MODE) {
      setFriend(FAKE_FRIEND_DETAILS[friendId] || null);
      setMessages([]);
      setChatRound(0);
      setChatLocked(false);
      setIsLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://node.me2vegan.com/api/friends/chat/${userId}/${friendId}`
        );
        setMessages(response.data || []);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `https://node.me2vegan.com/api/users/${friendId}`
        );
        setFriend(userResponse.data);
      } catch (error) {
        console.error("Error fetching freind details: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(loadingTimeout);
  }, [userId, friendId]);

  useEffect(() => {
    if (DEMO_MODE) return;
    socket.emit("joinRoom", { friendId });

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveRoom", { friendId });
    };
  }, [friendId]);

  // Demo 模式：自動捲到底
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    const token = getUserFromToken();
    if (!token) {
      deleteToken();
      showMessage("登入超時，請重新登入！", "error");
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
      return;
    }

    if (message.trim() !== "") {
      socket.emit("sendMessage", { friendId, talker: userId, message });
      setMessage("");
    }
  };

  // Demo 模式：選擇訊息發送
  const handleDemoOptionSend = (option) => {
    if (chatLocked) return;
    setChatLocked(true);

    const now = new Date().toISOString();
    // 發送自己的訊息
    setMessages(prev => [...prev, { talker: userId, message: option.send, time: now }]);

    // 對方打字中... 850ms 後回覆
    setTimeout(() => {
      setMessages(prev => [...prev, { talker: friendId, message: option.reply, time: new Date().toISOString() }]);
      setChatLocked(false);
      if (option.last) {
        setChatRound(-1); // 結束
      } else {
        setChatRound(prev => prev + 1);
      }
    }, 850);
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="chat-room">
          {friend && (
            <div className="friend-details">
              <img src={friend.image} alt={friend.name} />
              <div className="friend-details-area">
                <p>{friend.name}</p>
                <p className="friend-details-introduce">
                  {friend.introduce}
                </p>
              </div>
            </div>
          )}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.talker === userId ? "own-message" : ""
                }`}
              >
                <span>{new Date(msg.time).toLocaleString()}</span>
                <p className="single-message-box">{msg.message}</p>
              </div>
            ))}
            {/* Demo 模式：對方打字中提示 */}
            {DEMO_MODE && chatLocked && (
              <div className="message">
                <p className="single-message-box" style={{background:'rgb(210,231,255)',display:'inline-flex',gap:5,alignItems:'center'}}>
                  <span style={{width:8,height:8,background:'#7ab3e0',borderRadius:'50%',display:'inline-block',animation:'chatBounce 1.2s infinite'}}></span>
                  <span style={{width:8,height:8,background:'#7ab3e0',borderRadius:'50%',display:'inline-block',animation:'chatBounce 1.2s 0.2s infinite'}}></span>
                  <span style={{width:8,height:8,background:'#7ab3e0',borderRadius:'50%',display:'inline-block',animation:'chatBounce 1.2s 0.4s infinite'}}></span>
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Demo 模式：訊息選項 / 原本：文字輸入框 */}
          {DEMO_MODE ? (
            <div className="chat-input" style={{flexDirection:'column',gap:8}}>
              {chatRound === -1 ? (
                <p style={{color:'#bbb',fontSize:'14px',textAlign:'center',width:'100%',padding:'8px 0'}}>聊天結束，感謝體驗！😊</p>
              ) : (
                <>
                  <p style={{fontSize:'12px',color:'#bbb',marginBottom:4}}>選擇你想傳送的訊息 👇</p>
                  {(CHAT_SCRIPTS[friendId] || [])[chatRound]?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleDemoOptionSend(opt)}
                      disabled={chatLocked}
                      style={{
                        background:'#fff',
                        border:'1.5px solid rgb(255,150,112)',
                        borderRadius:22,
                        padding:'8px 16px',
                        fontSize:14,
                        textAlign:'left',
                        cursor: chatLocked ? 'not-allowed' : 'pointer',
                        opacity: chatLocked ? 0.45 : 1,
                        transition:'background .15s,color .15s',
                        width:'100%',
                      }}
                      onMouseEnter={e => { if(!chatLocked) { e.target.style.background='rgb(255,150,112)'; e.target.style.color='#fff'; }}}
                      onMouseLeave={e => { e.target.style.background='#fff'; e.target.style.color=''; }}
                    >
                      {opt.send}
                    </button>
                  ))}
                </>
              )}
              <style>{`@keyframes chatBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
            </div>
          ) : (
            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder="write something..."
              />
              <button onClick={handleSendMessage}>發送</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
