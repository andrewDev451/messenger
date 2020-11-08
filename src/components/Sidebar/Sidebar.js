import React, {useEffect, useState} from 'react'
import "./Sidebar.css"
import {Avatar} from "@material-ui/core/";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import Badge from "@material-ui/core/Badge";
import SidebarChat from "../SidebarChat/SidebarChat";
import db from "../../firebase";
import {useStateValue} from "../../StateProvider";
import {withStyles} from '@material-ui/core/styles';
import UseWindowDimensions from "../../UseWindowDimensions";
import {actionTypes} from "../../reducer";


const Sidebar = () => {
    const [rooms, setRooms] = useState([])
    const [{user}] = useStateValue()
    const [sidebarBool, setSidebarBool] = useState(true);
    const [search, setSearch] = useState([]);
    const [input, setInput] = useState("");
    const [toggler, setToggler]=useState(false);
    const [{togglerState}, dispatch]= useStateValue();
    const { width } = UseWindowDimensions();

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

    useEffect(() => {
        if (rooms.length > 0) {
            setSearch(matcher(input, rooms));
        }
        if (input === "") {
            setSidebarBool(true);
        }
    }, [input])

    useEffect(()=>{
        setToggler(!toggler);
    },[togglerState])

    const matcher = (s, values) => {
        const re = RegExp(`.*${s.toLowerCase().split('').join('.*')}.*`)
        return values.filter(v => v.data.name.toLowerCase().match(re));
    }

    const handleChange = (e) => {
        setSidebarBool(false);
        setInput(e.target.value);
    }

    const handleDrawerToggle =() =>{
        setToggler(toggler);

        dispatch({
            type:actionTypes.SET_TOGGLER,
            togglerState:togglerState+1
        })
    };

    const SmallAvatar = withStyles((theme) => ({
        root: {
            width: 10,
            height: 10,
        },
    }))(Avatar)

    return (
        <> { width < 629 ? (
            <div className={togglerState%2!==0?"sidebar":"sidebar hide__sidebar"}>
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
                            value={input}
                            onChange={handleChange}
                            placeholder="Search or start new chat"
                            type="text"
                        />
                    </div>
                </div>

                {(sidebarBool) ? (
                    <div className="sidebar__chats">
                        <h1>Chats</h1>
                        {rooms.map(room => (
                            <SidebarChat
                                key={room.id}
                                id={room.id}
                                name={room.data.name}
                                img={room.data.img}
                            />
                        ))}
                    </div>

                ) : (
                    <div className="sidebar__chats ">
                        <h1>Chats</h1>
                        {search.map(room => (
                            <SidebarChat
                                key={room.id}
                                id={room.id}
                                name={room.data.name}
                                img={room.data.img}
                            />
                        ))}
                    </div>
                )}
            </div>
            ) : (
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
                            value={input}
                            onChange={handleChange}
                            placeholder="Search or start new chat"
                            type="text"
                        />
                    </div>
                </div>

                {(sidebarBool) ? (
                    <div className="sidebar__chats">
                        <h1>Chats</h1>
                        {rooms.map(room => (
                            <SidebarChat
                                key={room.id}
                                id={room.id}
                                name={room.data.name}
                                img={room.data.img}
                            />
                        ))}
                    </div>

                ) : (
                    <div className="sidebar__chats ">
                        <h1>Chats</h1>
                        {search.map(room => (
                            <SidebarChat
                                key={room.id}
                                id={room.id}
                                name={room.data.name}
                                img={room.data.img}
                            />
                        ))}
                    </div>
                )}
            </div>
        )

        }

            </>)
}

export default Sidebar
