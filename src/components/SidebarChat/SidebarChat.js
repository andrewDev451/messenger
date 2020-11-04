import React, { useEffect, useState } from 'react'
import './SidebarChat.css'
import Avatar from "@material-ui/core/Avatar";
import db from "../../firebase";
import {Link} from "react-router-dom";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core";

const SidebarChat = ({ addNewChat, id, name, img }) => {
    const [messages, setMessages] = useState('')

    useEffect(() => {
        if (id) {
            db.collection('rooms')
                .doc(id)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot =>
                    setMessages(snapshot.docs.map((doc) =>
                    doc.data()))
                )
        }
    }, [id])

    const createChat = () => {
        const roomName = prompt("Please enter name for chat")

        if (roomName) {
            db.collection('rooms').add({
                name: roomName
            })
        }
    }

    const options = { year: 'numeric', month: 'short', day: 'numeric'};
    const SmallAvatar = withStyles((theme) => ({
        root: {
            width: 10,
            height: 10,
        },
    }))(Avatar);
    const timestamp =  new Date( messages[0]?.timestamp?.toDate()).toLocaleDateString("en-US", options)

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <div className="sidebarChat__container">
                    <Badge
                        overlap="circle"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        badgeContent={<SmallAvatar
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Noun_Project_tick_icon_675776_cc.svg/768px-Noun_Project_tick_icon_675776_cc.svg.png"/>}
                    >
                        <Avatar src={ img } />
                    </Badge>
                    <div className="sidebarChat__info">
                        <h2>{ name }</h2>
                        <p>{ messages[0]?.message }</p>
                    </div>
                </div>
                <span className="sidebarChat__timestamp">
                    { timestamp }
                </span>
            </div>
        </Link>
    ) : (
        <div onClick={ createChat } className="sidebarChat">
            <h2>Add new Chat</h2>
        </div>
    )
}

export default SidebarChat