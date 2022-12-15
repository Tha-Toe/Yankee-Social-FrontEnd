import React, { useEffect } from "react";
import { useState } from "react";
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
  setOpenPostUploadPage,
  openOtherProfileFromPostNameClick,
  randomPostData,
  reloadPostRequest,
  addToLocalCurrentCommentData,
  removeLocalCurrentComment,
}) {
  //follower open state
  const [followerOpenInFollower, setFollowerOpenInFollower] = useState(true);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);

  //openFollowerInFollower function
  const openFollowerFromProfile = (e) => {
    setHomeOpen(false);
    setFollowerOpen(true);
    setProfileOpen(false);
    setBarOpen(false);
    setNotiOpen(false);
    if (e === "openFollowerInFollower") {
      setFollowerOpenInFollower(true);
      setFollowingOpen(false);
      setSuggestOpen(false);
    } else {
      setFollowerOpenInFollower(false);
      setFollowingOpen(true);
      setSuggestOpen(false);
    }
  };

  return (
    <>
      <div className="container">
        {homeOpen && (
          <Home
            setOpenPostUploadPage={setOpenPostUploadPage}
            openOtherProfileFromPostNameClick={
              openOtherProfileFromPostNameClick
            }
            randomPostData={randomPostData}
            reloadPostRequest={reloadPostRequest}
            addToLocalCurrentCommentData={addToLocalCurrentCommentData}
            removeLocalCurrentComment={removeLocalCurrentComment}
          />
        )}
        {followerOpen && (
          <Follower
            setChangeSomething={setChangeSomething}
            openOtherProfileFromFollowerAndFollowingClick={
              openOtherProfileFromFollowerAndFollowingClick
            }
            setOtherProfileOpen={setOtherProfileOpen}
            followerOpenInFollower={followerOpenInFollower}
            setFollowerOpenInFollower={setFollowerOpenInFollower}
            followingOpen={followingOpen}
            setFollowingOpen={setFollowingOpen}
            suggestOpen={suggestOpen}
            setSuggestOpen={setSuggestOpen}
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
            profileOpen={profileOpen}
            openOtherProfileFromPostNameClick={
              openOtherProfileFromPostNameClick
            }
            openFollowerFromProfile={openFollowerFromProfile}
            reloadPostRequest={reloadPostRequest}
          />
        )}
        {notiOpen && <Noti />}
        {barOpen && <Bar />}
      </div>
    </>
  );
}

export default Container;
