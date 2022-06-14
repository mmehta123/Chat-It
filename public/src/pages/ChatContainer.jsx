import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";  
import axios from "axios";
import { getMessageRoute, SendMessageRoute } from "../utils/apiRoutes";


const ChatContainer = ({ currentChat, currentUser, socket }) => {

  const [messages, setMessages] = useState([]);

  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const getMsg = async () => {
    if (currentChat) {
      const data = await axios.post(getMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
      })
      setMessages(data.data);
      
    }
  }

  useEffect(() => {
    getMsg();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg,
    });

    await axios.post(SendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      msg: msg,
    }
    )

    const msgs = [...messages];
    const d=new Date();
    msgs.push({ fromSelf: true, message: msg, time: new Date()});
    setMessages(msgs);
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-received", (msg) => {
        
        setArrivalMessage({ fromSelf: false, message: msg ,time:new Date()});
      });
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);



  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {
          messages.map((message) => {
            const t=new Date(message.time);
            const time=t.toLocaleString()
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
                  <div className="content">
                    <div>
                    <p>{message.message}</p>
                    </div>
                    <span className="time">
                      {time}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>

  )
}

export default ChatContainer;

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .time{
        color:blue;
        border:1px solid #4f04ff21;
        border-radius:5px;
        background-color:white; 
      }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
        padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;