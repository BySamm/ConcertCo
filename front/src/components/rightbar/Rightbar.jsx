import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { io } from "socket.io-client";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?.id));
  const socket = useRef();

  useEffect(() => {
    console.log("Current User in Rightbar component:", currentUser); 
  }, [currentUser]);

  //useEffect for friends
  useEffect(() => {
    const getFriends = async () => {
      console.log('User in Rightbar component:', user);
      try {

        if (!user) {
          console.log('User is undefined');
          return; // Exit early if user is undefined
        }

        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
        console.log('FriendsList', friendList.data)
      } catch (err) {
        console.error(err);
      }
    };
    getFriends();
  }, [user]);

  //useEffect for online users
  useEffect(() => {

    if (!currentUser) {
      return;
    }

    socket.current = io("ws://localhost:8900"); 
    socket.current.emit("addUser", currentUser._id); 
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => {
      console.log("Received online users:", users);
      setOnlineUsers(
        currentUser.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [currentUser]);

  const handleClick = async () => {
    try {
      
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };

      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        }, config);
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        }, config);
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          {/* <img className="birthdayImg" src="assets/gift.png" alt="" /> */}
          <span className="birthdayText">
            <b>Meet</b> with <b>mingle</b> is the next event.
          </span>
        </div>
        <img className="rightbarAd" src="assets/concert3.jpg" alt="" />
        <h4 className="rightbarTitle">Online Fans</h4>

        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={currentUser._id}
              // setCurrentChat={setCurrentChat}
            />
          </div>
        </div>

      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 1
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
