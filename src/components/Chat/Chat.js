import React, {useEffect, useState} from 'react'
import Avatar from "@material-ui/core/Avatar";
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import {useParams} from "react-router-dom";
import './Chat.css'
import db from "../../firebase";
import firebase from 'firebase'
import {useStateValue} from "../../StateProvider";
import Badge from "@material-ui/core/Badge";
import {withStyles} from "@material-ui/core";
import alertify from 'alertifyjs'
import 'alertifyjs/build/css/alertify.css';


const Chat = () => {
    const [input, setInput] = useState('')
    const {roomId} = useParams()
    const [roomName, setRoomName] = useState('')
    const [image, setImage] = useState('')
    const [messages, setMessages] = useState([])
    const [chuckMessage, setChuckMessage] = useState('')
    const [{user}] = useStateValue()

    useEffect(() => {
        if (roomId) {

            db.collection("rooms")
                .doc(roomId)
                .onSnapshot((snapshot) => {
                    setRoomName(snapshot.data().name);
                });

            db.collection("rooms")
                .doc(roomId)
                .onSnapshot((snapshot) => {
                    setImage(snapshot.data().img);
                });

            db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) => {
                    setMessages(snapshot.docs.map((doc) => doc.data()));
                });
        }
    }, [roomId]);

    useEffect(() => {
        fetch("https://api.chucknorris.io/jokes/random")
            .then(response => response.json())
            .then(data => {
                console.log("CHUCK NORRIS-----", data.value)
                setChuckMessage(data.value)
            })
    }, [messages])

    const sendMessage = (e) => {
        e.preventDefault()
        db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .add({
                message: input,
                name: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })

        setTimeout(() => {
            db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .add({
                    message: chuckMessage,
                    name: "Chuck Norris",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })

                alertify.notify('You have a new message!', 'success', 5, function(){  console.log('dismissed'); });

        }, 5000)

        setInput('')
    }

    const options = {year: '2-digit', month: '2-digit', day: 'numeric', hour: 'numeric', minute: '2-digit'};
    const SmallAvatar = withStyles((theme) => ({
        root: {
            width: 10,
            height: 10,
        },
    }))(Avatar);

    return (
        <div className="chat">
            <div className="chat__header">
                <Badge
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    badgeContent={<SmallAvatar
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Noun_Project_tick_icon_675776_cc.svg/768px-Noun_Project_tick_icon_675776_cc.svg.png"/>}
                >
                    <Avatar src={image}/>
                </Badge>

                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                </div>
            </div>

            <div className="chat__body">
                {messages.map((message, id) => (
                    <div key={id}
                         className={`chat__container ${message.name === user.displayName && `chat__container-receiver`}`}>
                        <Avatar className={message.name === user.displayName && `chat__img`} src={image}/>
                        <div className="chat__container-info">
                            <p className={`chat__message ${message.name === user.displayName && `chat__receiver`}`}>
                                {message.message}
                            </p>
                            <span
                                className={`chat__timestamp ${message.name === user.displayName && `chat__timestamp-receiver`}`}>
                                {new Date(message.timestamp?.toDate()).toLocaleDateString("en-US", options)}
                        </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="chat__footer">
                <form>
                    <div className="chat__footer-container">
                        <input
                            onChange={e => setInput(e.target.value)}
                            value={input}
                            placeholder="Type your message"
                            type="text"
                        />
                        <button onClick={sendMessage} type="submit">Send a message</button>
                        <SendOutlinedIcon/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Chat