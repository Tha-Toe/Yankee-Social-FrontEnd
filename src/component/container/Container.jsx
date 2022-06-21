import React, { useEffect } from "react";
import Bar from "../bar/Bar";
import Follower from "../follower/followerContainer/Follower";
import Home from "../home/Home";
import Noti from "../noti/Noti";
import Profile from "../profile/Profile";
import "./container.scss";

function Container({
  homeOpen,
  followerOpen,
  profileOpen,
  notiOpen,
  barOpen,
  setHomeOpen,
  setFollowerOpen,
  setProfileOpen,
  setNotiOpen,
  setBarOpen,
  setNavWidth,
  setNavLeft,
  setChangeSomething,
  openOtherProfileFromFollowerAndFollowingClick,
  setOtherProfileOpen,
}) {
  return (
    <div className="container">
      {homeOpen && <Home />}
      {followerOpen && (
        <Follower
          setChangeSomething={setChangeSomething}
          openOtherProfileFromFollowerAndFollowingClick={
            openOtherProfileFromFollowerAndFollowingClick
          }
          setOtherProfileOpen={setOtherProfileOpen}
        />
      )}
      {profileOpen && (
        <Profile
          setHomeOpen={setHomeOpen}
          setFollowerOpen={setFollowerOpen}
          setProfileOpen={setProfileOpen}
          setNotiOpen={setNotiOpen}
          setBarOpen={setBarOpen}
          setNavWidth={setNavWidth}
          setNavLeft={setNavLeft}
          setChangeSomething={setChangeSomething}
        />
      )}
      {notiOpen && <Noti />}
      {barOpen && <Bar />}
    </div>
  );
}

export default Container;
