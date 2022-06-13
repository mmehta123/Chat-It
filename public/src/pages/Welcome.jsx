import styled from "styled-components";
import robot from "../assets/robot.gif";


const Welcome=({currentUser})=>{
    return (
        <Container>
            <img src={robot} alt="robot"/>
            {
                currentUser!==undefined && (<h1>Welcome, <span>{currentUser.username}</span></h1>)
            }
            <h3>Please Select A Chat To Start Messaging.</h3>
        </Container>
    );
}

export default Welcome;

const Container=styled.div`
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
overflow:hidden;
color:white;
img{
    height:15rem
}
span{
    color:blue
}
`;