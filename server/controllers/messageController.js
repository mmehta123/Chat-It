const Message = require("../models/messageModel");


const addMessage = async (req, res, next) => {
    try {

        const {from,to,msg } = req.body;

        const data = await Message.create({
            message: { text: msg },
            users: [from,to],
            sender: from
        });
        
        if (data) {
            return res.json({ msg: "message added successfully to DB" });
        }
        return res.json({ msg: "Failed" });
    } catch (e) {
        next(e);
    }
}

const getAllMessage = async (req, res, next) => {
    try {
        const {from,to}=req.body;

        const messages=await Message.find(
            {
                users:{$all:[from,to]}  
            }
        ).sort({updatedAt:1});

        
        const projectedMessages=messages.map((msg)=>{
            return {
                fromSelf:msg.sender.toString()===from,
                message: msg.message.text
            }
        });



        return res.json(projectedMessages);
    } catch (error) {
        return res.json({ msg: error.message });    
    }
}


module.exports = { addMessage, getAllMessage };



