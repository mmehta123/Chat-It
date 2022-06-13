import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute } from '../utils/apiRoutes';
import Contacts from "../pages/Contacts";
import Welcome from "../pages/Welcome";
import {io} from "socket.io-client"
import ChatContainer from "../pages/ChatContainer"
import { useRef } from "react";


function Chat() {
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const navigate = useNavigate();
    const socket=useRef();

    useEffect(()=>{
        if(currentUser){
            socket.current=io("http://localhost:5000");
            socket.current.emit("add-user",currentUser._id);
        }
    },[currentUser]);

    const userCheck = async () => {
        if (!localStorage.getItem("chat-app-user")) {
            navigate("/login");
        } else {
            setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        }
    }
    useEffect(() => {
        userCheck();
    }, [])

    const getUserData = async () => {
        if (currentUser) {
            if (currentUser.isAvatarImageSet) {
                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data);
            } else {
                navigate("/setAvatar")
            }
        }
    }

    useEffect(() => {
        getUserData()
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    }

    return (
        <Container>
            <div className="container">
                <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
                {
                    currentChat === undefined ?
                        <Welcome currentUser={currentUser} /> 
                        :
                        (<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>)  
                }
            </div>
        </Container>

    )

}

export default Chat;







const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;