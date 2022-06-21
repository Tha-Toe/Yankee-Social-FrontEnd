import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../component/container/Container";
import Nav from "../../component/nav/Nav";
import "./main.scss";
import { useSelector, useDispatch } from "react-redux";
import SearchBarPage from "../../component/nav/SearchBarPage";

function Main({ changeSomething, setChangeSomething }) {
  const [navWidth, setNavWidth] = useState("0px");
  const [navLeft, setNavLeft] = useState("0px");
  const [homeOpen, setHomeOpen] = useState(true);
  const [followerOpen, setFollowerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [barOpen, setBarOpen] = useState(false);
  const userData = useSelector((state) => state.data.userData);

  //navWidth
  const [profileWidth, setProfileWidth] = useState("");
  const [profileLeft, setProfileLeft] = useState("");

  const getProfileRef = (e) => {
    let profileWidthRaw = e.current.offsetWidth.toString() + "px";
    setProfileWidth(profileWidthRaw);
    let profileLeftRaw = e.current.offsetLeft.toString() + "px";
    setProfileLeft(profileLeftRaw);
  };

  const handleNav = (e) => {
    let widthValue = e.current.offsetWidth.toString() + "px";
    setNavWidth(widthValue);
    let leftValue = e.current.offsetLeft.toString() + "px";
    setNavLeft(leftValue);
  };
  const navBarChange = (e) => {
    let defaultWidth = e.current.offsetWidth.toString() + "px";
    setNavWidth(defaultWidth);

    let defaultLeft = e.current.offsetLeft.toString() + "px";
    setNavLeft(defaultLeft);
  };
  // searchBarOpen

  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const openSearchBar = () => {
    setSearchBarOpen(true);
  };
  const closeSearchBar = () => {
    setSearchBarOpen(false);
    setHomeOpen(true);
    setFollowerOpen(false);
    setProfileOpen(false);
    setNotiOpen(false);
    setBarOpen(false);
  };
  const openOwnerProfile = () => {
    setHomeOpen(false);
    setFollowerOpen(false);
    setProfileOpen(true);
    setNotiOpen(false);
    setBarOpen(false);
    setSearchBarOpen(false);
    setNavWidth(profileWidth);
    setNavLeft(profileLeft);
  };
  //otherProfileOpen
  const [otherProfileOpen, setOtherProfileOpen] = useState(false);
  const [otherUserData, setOtherUserData] = useState();
  //openOtherProfileFromFollowerAndFollowingClick
  const openOtherProfileFromFollowerAndFollowingClick = async (e) => {
    await setOtherUserData(e);
    console.log(e);
    await setProfileOpen(true);
    console.log(profileOpen);
    setSearchBarOpen(true);
  };
  return (
    <>
      {searchBarOpen ? (
        <SearchBarPage
          closeSearchBar={closeSearchBar}
          openOwnerProfile={openOwnerProfile}
          setChangeSomething={setChangeSomething}
          changeSomething={changeSomething}
          otherProfileOpen={otherProfileOpen}
          setOtherProfileOpen={setOtherProfileOpen}
          setOtherUserData={setOtherUserData}
          otherUserData={otherUserData}
        />
      ) : (
        <>
          <Nav
            homeOpen={homeOpen}
            setHomeOpen={setHomeOpen}
            followerOpen={followerOpen}
            setFollowerOpen={setFollowerOpen}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            notiOpen={notiOpen}
            setNotiOpen={setNotiOpen}
            barOpen={barOpen}
            setBarOpen={setBarOpen}
            setNavWidth={setNavWidth}
            setNavLeft={setNavLeft}
            navLeft={navLeft}
            navWidth={navWidth}
            openSearchBar={openSearchBar}
            handleNav={handleNav}
            getProfileRef={getProfileRef}
            navBarChange={navBarChange}
          />
          <Container
            homeOpen={homeOpen}
            setHomeOpen={setHomeOpen}
            followerOpen={followerOpen}
            setFollowerOpen={setFollowerOpen}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            notiOpen={notiOpen}
            setNotiOpen={setNotiOpen}
            barOpen={barOpen}
            setBarOpen={setBarOpen}
            setNavWidth={setNavWidth}
            setNavLeft={setNavLeft}
            setChangeSomething={setChangeSomething}
            openOtherProfileFromFollowerAndFollowingClick={
              openOtherProfileFromFollowerAndFollowingClick
            }
            setOtherProfileOpen={setOtherProfileOpen}
          />
        </>
      )}
    </>
  );
}
export default Main;
