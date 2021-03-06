import React, { useEffect, useState } from 'react'
import './SidebarChat.css'
import Avatar from "@material-ui/core/Avatar";
import db from "../../firebase";
import { Link } from "react-router-dom";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core";
import {useStateValue} from "../../StateProvider";
import {actionTypes} from "../../reducer";

const SidebarChat = ({ id, name, img }) => {
    const [messages, setMessages] = useState('')

    useEffect(() => {
        if (id) {
            const unsubscribe = db.collection('rooms')
                .doc(id)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot =>
                    setMessages(snapshot.docs.map((doc) =>
                    doc.data()))
                )

            return () => {
                unsubscribe()
            }
        }
    }, [id])

    const options = { year: 'numeric', month: 'short', day: 'numeric'};
    const SmallAvatar = withStyles((theme) => ({
        root: {
            width: 10,
            height: 10,
        },
    }))(Avatar);
    const timestamp =  new Date( messages[0]?.timestamp?.toDate()).toLocaleDateString("en-US", options)
    const [{togglerState}, dispatch]= useStateValue();

    const handleChat =()=>{
        dispatch({
            type:actionTypes.SET_TOGGLER,
            togglerState:togglerState+1
        })

    }

    return (
        <Link to={`/rooms/${id}`} onClick={handleChat} >
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
                        <div className="sidebarChat__info-container">
                            <h2>{ name }</h2> <span>{ timestamp }</span>
                        </div>
                        <p>{ messages[0]?.message }</p>
                    </div>
                </div>

            </div>
        </Link>
    )
}

export default SidebarChat