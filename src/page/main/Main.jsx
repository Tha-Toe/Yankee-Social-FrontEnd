import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../component/container/Container";
import Nav from "../../component/nav/Nav";
import "./main.scss";
import { useSelector, useDispatch } from "react-redux";
import SearchBarPage from "../../component/nav/SearchBarPage";
import PostUploadContainer from "../../component/container/PostUploadContainer";
import axios from "axios";
import NavIcon from "../../component/nav/NavIcon";

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
    if (e.email === userData.email) {
      openOwnerProfile();
    } else {
      setOtherUserData(e);
      setOtherProfileOpen(true);
      setSearchBarOpen(true);
    }
  };

  const openOtherProfileFromPostNameClick = async (e) => {
    if (e.email === userData.email) {
      openOwnerProfile();
    } else {
      setOtherUserData(e);
      setSearchBarOpen(true);
      setOtherProfileOpen(true);
    }
  };

  //open post upload page
  const [openPostUploadPage, setOpenPostUploadPage] = useState(false);

  //randomPostData
  const [randomPostData, setRandomPostData] = useState([]);
  useEffect(() => {
    const getRandomPostData = async () => {
      //console.log("run");
      setRandomPostData([]);
      const url = "https://yankee-server.herokuapp.com/api/getpostdata";
      const { data: res } = await axios.post(url, {
        getRandomPostData: "getRandomPostData",
      });
      //console.log(res.randomPostData);
      //console.log("post data reached");
      setRandomPostData(res.randomPostData);
      //console.log(res.randomPostData);
    };
    getRandomPostData();
  }, []);
  const reloadPostRequest = (index) => {
    let randomPostDataPop = [...randomPostData];
    randomPostDataPop.splice(index, 1);
    setRandomPostData(randomPostDataPop);
  };

  //addToLocalCurrentCommentData
  const addToLocalCurrentCommentData = async (e) => {
    const objectToAddCurrentCommentData = await e.objectToAddCurrentCommentData;
    const index = await e.index;
    let randomPostDataRaw = randomPostData;
    await randomPostDataRaw[index].comment.push(objectToAddCurrentCommentData);
  };
  const removeLocalCurrentComment = async (e) => {
    let postIndex = e.postIndex;
    let commentIndex = e.commentIndex;
    let randomPostDataRawToDelete = randomPostData;
    await randomPostDataRawToDelete[postIndex].comment.splice(commentIndex, 1);
    setRandomPostData(randomPostDataRawToDelete);
  };
  return (
    <>
      {openPostUploadPage ? (
        <PostUploadContainer setOpenPostUploadPage={setOpenPostUploadPage} />
      ) : (
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
              openOtherProfileFromPostNameClick={
                openOtherProfileFromPostNameClick
              }
              openOtherProfileFromFollowerAndFollowingClick={
                openOtherProfileFromFollowerAndFollowingClick
              }
              reloadPostRequest={reloadPostRequest}
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
              <NavIcon
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
                setOpenPostUploadPage={setOpenPostUploadPage}
                openOtherProfileFromPostNameClick={
                  openOtherProfileFromPostNameClick
                }
                randomPostData={randomPostData}
                reloadPostRequest={reloadPostRequest}
                addToLocalCurrentCommentData={addToLocalCurrentCommentData}
                removeLocalCurrentComment={removeLocalCurrentComment}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
export default Main;
