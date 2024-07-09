import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  HelpOutline,
  Event,
} from "@mui/icons-material";
import axios from "axios";
import CloseFans from "../community/Community";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  // useEffect for all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        const users = response.data.filter(u => u._id !== currentUser._id);
        setAllUsers(users);
        console.log('Users:', users)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <Link to={`/messenger/${user.username}`} className='noLink'>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          </Link>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
         
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
         
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
         
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <h3 className="community">Community</h3>
        <ul className="sidebarFriendList">
          {allUsers.map((u) => (
            <CloseFans key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}
