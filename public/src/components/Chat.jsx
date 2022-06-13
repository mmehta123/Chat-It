import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute } from '../utils/apiRoutes';
import Contacts from "../pages/Contacts";
import Welcome from "../pages/Welcome";


function Chat() {
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined); 
    const [currentChat,setCurrentChat]=useState(undefined);
    const navigate = useNavigate();


    const userCheck = async () => {
        if (!localStorage.getItem("chat-app-user")) {
            // console.log("user not exists");
            navigate("/login");
        } else {
            setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
            // console.log("user exists ");
        }
    }
    useEffect(() => {
        userCheck();
    }, [])

    const getUserData = async () => {
        if (currentUser) {
            if (currentUser.isAvatarImageSet) {
                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                // console.log(data);
                setContacts(data.data);
            } else {
                navigate("/setAvatar")
            }
        }
    }

    useEffect(() => {
        getUserData()
    }, [currentUser]);

    const handleChatChange=(chat)=>{
        setCurrentChat(chat);
    }

    return (
        <Container>
            <div className="container">
            <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
            <Welcome currentUser={currentUser}/>
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