import React, { useEffect, useRef, useState } from "react";
import "./navIcon.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faCommentDots,
  faHouse,
  faMagnifyingGlass,
  faMessage,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

function NavIcon({
  setHomeOpen,
  setFollowerOpen,
  setProfileOpen,
  setNotiOpen,
  setBarOpen,
  homeOpen,
  followerOpen,
  profileOpen,
  notiOpen,
  barOpen,
  navWidth,
  navLeft,
  handleNav,
  navBarChange,
}) {
  const houseRef = useRef();
  const followerRef = useRef();
  const profileRef = useRef();
  const bellRef = useRef();
  const barRef = useRef();

  useEffect(() => {
    if (homeOpen) {
      navBarChange(houseRef);
    } else if (followerOpen) {
      navBarChange(followerRef);
    } else if (profileOpen) {
      navBarChange(profileRef);
    } else if (notiOpen) {
      navBarChange(bellRef);
    } else {
      navBarChange(barRef);
    }
  }, [homeOpen, followerOpen, profileOpen, notiOpen, barOpen]);

  const handlePage = (e) => {
    if (e === "home") {
      setHomeOpen(true);
      setFollowerOpen(false);
      setProfileOpen(false);
      setNotiOpen(false);
      setBarOpen(false);
    } else if (e === "follower") {
      setHomeOpen(false);
      setFollowerOpen(true);
      setProfileOpen(false);
      setNotiOpen(false);
      setBarOpen(false);
    } else if (e === "profile") {
      setHomeOpen(false);
      setFollowerOpen(false);
      setProfileOpen(true);
      setNotiOpen(false);
      setBarOpen(false);
    } else if (e === "noti") {
      setHomeOpen(false);
      setFollowerOpen(false);
      setProfileOpen(false);
      setNotiOpen(true);
      setBarOpen(false);
    } else {
      setHomeOpen(false);
      setFollowerOpen(false);
      setProfileOpen(false);
      setNotiOpen(false);
      setBarOpen(true);
    }
  };

  return (
    <div className="navIconContainer">
      <div className="navBottom">
        <div className="navIconContainer">
          <div className="navIconChild">
            <div ref={houseRef}>
              <FontAwesomeIcon
                icon={faHouse}
                className={`${"navIcon"} ${homeOpen ? "iconActive" : ""}`}
                onClick={() => {
                  handleNav(houseRef);
                  handlePage("home");
                }}
              />
            </div>
            <div ref={followerRef}>
              <FontAwesomeIcon
                icon={faUserGroup}
                className={`${"navIcon"} ${followerOpen ? "iconActive" : ""}`}
                onClick={() => {
                  handleNav(followerRef);
                  handlePage("follower");
                }}
              />
            </div>
            <div ref={profileRef}>
              <FontAwesomeIcon
                icon={faUser}
                className={`${"navIcon"} ${profileOpen ? "iconActive" : ""}`}
                onClick={() => {
                  handleNav(profileRef);
                  handlePage("profile");
                }}
              />
            </div>
            <div ref={bellRef}>
              <FontAwesomeIcon
                icon={faBell}
                className={`${"navIcon"} ${notiOpen ? "iconActive" : ""}`}
                onClick={() => {
                  handleNav(bellRef);
                  handlePage("noti");
                }}
              />
            </div>
            <div ref={barRef}>
              <FontAwesomeIcon
                icon={faBars}
                className={`${"navIcon"} ${barOpen ? "iconActive" : ""}`}
                onClick={() => {
                  handleNav(barRef);
                  handlePage("bar");
                }}
              />
            </div>
          </div>
          <div
            className="navBar"
            style={{ width: navWidth, marginLeft: navLeft }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default NavIcon;
