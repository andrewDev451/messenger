import React, {useEffect, useState} from 'react'
import "./Sidebar.css"
import {Avatar} from "@material-ui/core/";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import SidebarChat from "../SidebarChat/SidebarChat";
import db from "../../firebase";
import {useStateValue} from "../../StateProvider";
import Badge from "@material-ui/core/Badge";
import {withStyles} from '@material-ui/core/styles';

const Sidebar = () => {
    const [rooms, setRooms] = useState([])
    const [{user}] = useStateValue()

    useEffect(() => {
        const unsubscribe = db.collection('rooms')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>
                setRooms(snapshot.docs.map((doc) =>
                    ({
                        id: doc.id,
                        data: doc.data()
                    })
                ))
            )

        return () => {
            unsubscribe()
        }
    }, [])

    const SmallAvatar = withStyles((theme) => ({
        root: {
            width: 10,
            height: 10,
        },
    }))(Avatar);

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Badge
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    badgeContent={<SmallAvatar
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Noun_Project_tick_icon_675776_cc.svg/768px-Noun_Project_tick_icon_675776_cc.svg.png"/>}
                >
                    <Avatar src={user?.photoURL}/>
                </Badge>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined/>
                    <input
                        placeholder="Search or start new chat"
                        type="text"
                    />
                </div>
            </div>

            <div className="sidebar__chats">
                <SidebarChat addNewChat/>
                {rooms.map(room => (
                    <SidebarChat
                        key={room.id}
                        id={room.id}
                        name={room.data.name}
                        img={room.data.img}
                    />
                ))}
            </div>
        </div>
    )
}

export default Sidebar