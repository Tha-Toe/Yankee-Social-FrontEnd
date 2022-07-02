import React, { useEffect, useState } from "react";
import "./otherProfile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faEllipsisVertical,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import PostCard from "../home/PostCard";
import axios from "axios";
import LoadingPostCard from "../home/LoadingPostCard";
import OtherUserFollowerList from "./OtherUserFollowerList";

function OtherProfile({
  otherUserData,
  changeSomething,
  setChangeSomething,
  openOtherProfileFromPostNameClick,
  openOtherProfileFromFollowerAndFollowingClick,
  setReloadPostRequest,
  reloadPostRequest,
}) {
  const [tempoState, setTempoState] = useState({
    caption:
      "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies",
    img: "/testImg.jpg",
    like: "23",
    comment: "23",
    share: "13",
  });
  const [userName, setUserName] = useState("");
  const [userNameKey, setUserNameKey] = useState("");
  const [userCaption, setUserCaption] = useState("");
  const [userFollower, setUserFollower] = useState([]);
  const [userFollowerAmount, setUserFollowerAmount] = useState();
  const [userFollowing, setUserFollowing] = useState([]);
  const [userFollowingAmount, setUserFollowingAmount] = useState();
  const [userLikes, setUserLikes] = useState("");
  const [profileImage, setProfileImage] = useState({});
  const [coverPhoto, setCoverPhoto] = useState({});
  const [otherUserEmail, setOtherUserEmail] = useState("");

  const arrayBufferToBase64 = async (buffer) => {
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    await bytes.forEach((each) => (binary += String.fromCharCode(each)));
    return window.btoa(binary);
  };
  useEffect(() => {
    async function addData() {
      if (otherUserData) {
        //console.log(otherUserData.profileImage);
        let name = otherUserData.firstName + " " + otherUserData.lastName;
        setOtherUserEmail(otherUserData.email);
        setUserName(name);
        setUserFollower(otherUserData.follower);
        if (otherUserData.follower.followerPeople.length <= 0) {
          setUserFollowerAmount(0);
        } else {
          setUserFollowerAmount(otherUserData.follower.followerPeople.length);
        }
        setUserFollowing(otherUserData.following);
        if (otherUserData.following.followingPeople.length <= 0) {
          setUserFollowingAmount(0);
        } else {
          setUserFollowingAmount(
            otherUserData.following.followingPeople.length
          );
        }
        setUserCaption(otherUserData.caption);
        setUserLikes(otherUserData.likes);
        setUserNameKey(otherUserData.nameKey);
      }

      if (otherUserData.profileImage) {
        let base64ProfilePhotoString = await arrayBufferToBase64(
          otherUserData.profileImage.data.data
        );
        setProfileImage({
          contentType: otherUserData.profileImage.contentType,
          data: base64ProfilePhotoString,
        });
      }

      if (otherUserData.coverPhoto) {
        let base64CoverPhotoString = await arrayBufferToBase64(
          otherUserData.coverPhoto.data.data
        );
        setCoverPhoto({
          contentType: otherUserData.coverPhoto.contentType,
          data: base64CoverPhotoString,
        });
      }
    }
    addData();
  }, [otherUserData]);

  //myData
  const myData = useSelector((state) => state.data.userData);

  const [myEmail, setMyEmail] = useState("");
  useEffect(() => {
    setMyEmail(myData.email);
    //console.log(myData);
  }, [myData]);

  //followFunction
  const handelfollow = async (e) => {
    if (followButtonDelay === 1) {
      return;
    } else {
      activeDelay();
      setIAlreadyFollow(!iAlreadyFollow);
      setUnfollowOpen(false);
      if (e === "plus") {
        let changeFollower = userFollowerAmount;
        changeFollower++;
        await setUserFollowerAmount(changeFollower);
        console.log(changeFollower);
      } else {
        let changeFollower = userFollowingAmount;
        if (changeFollower > 0) {
          changeFollower--;
          await setUserFollowerAmount(changeFollower);
          console.log(changeFollower);
        }
      }
      const url = "https://yankee-server.herokuapp.com/api/follow";
      const { data: res } = await axios.post(url, {
        otherEmail: otherUserEmail,
        myEmail: myEmail,
      });
      setfollowButtonDelay(0);
      setChangeSomething(true);
      //console.log(myData.following.followingAmount);
    }
  };
  //valid follow or unFollow
  const [iAlreadyFollow, setIAlreadyFollow] = useState(false);
  useEffect(() => {
    let myFollowRaw = myData.following;
    if (myFollowRaw.followingPeople.length >= 0) {
      let indexCheck = myFollowRaw.followingPeople.indexOf(otherUserData.email);
      //console.log(myFollowRaw.followingPeople);
      //console.log(otherUserData.email);
      if (indexCheck === -1) {
        setIAlreadyFollow(false);
        //console.log("here");
        //console.log("here1");
      } else {
        setIAlreadyFollow(true);
        //console.log("here");
      }
    } else {
      setIAlreadyFollow(false);
      //console.log("here2");
    }
    //console.log(iAlreadyFollow);
  }, [myData]);

  //unfollowSection
  const [unfollowOpen, setUnfollowOpen] = useState(false);
  const unFollowOpenDelay = () => {
    if (followButtonDelay === 1) {
      return;
    } else {
      setUnfollowOpen(true);
    }
  };

  //follow click delay
  const [followButtonDelay, setfollowButtonDelay] = useState(0);
  const activeDelay = () => {
    setfollowButtonDelay(1);
  };

  //get post data
  const [randomPostData, setRandomPostData] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  useEffect(() => {
    async function getMyAllPostData() {
      //console.log("start");
      if (otherUserEmail) {
        const url = "https://yankee-server.herokuapp.com/api/getpostdata";
        const { data: res } = await axios.post(url, {
          getMyAllPostData: "getMyAllPostData",
          myEmail: otherUserEmail,
        });
        setRandomPostData(res.myAllPostData);
        setLoadingPost(false);
      }
    }
    getMyAllPostData();
  }, [otherUserEmail]);

  //other user follower;
  const [openOtherUserFollower, setOpenOtherUserFollower] = useState(false);

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
      {openOtherUserFollower ? (
        <div className="otherUserFollowerContainer">
          <div
            className="backIconOtherUserFollowerContainer"
            onClick={() => {
              setOpenOtherUserFollower(false);
            }}
          >
            <FontAwesomeIcon
              icon={faArrowLeftLong}
              className="backIconOtherUserFollower"
            />
            <div className="backIconText">Back to {userName}'s profile</div>
          </div>
          <div className="otherUserFollowerAmountContainer">
            <div className="otherUserFollowerAmountText">follower -</div>
            <div className="otherUserFollowerAmount">{userFollowerAmount}</div>
          </div>
          <div className="otherUserFollowerListContainer">
            {userFollowerAmount === 0 ? (
              <div className="noFollowerTag">No follower</div>
            ) : (
              <>
                {userFollower.followerPeople.map((otherUserFollower, index) => (
                  <OtherUserFollowerList
                    key={index}
                    otherUserFollower={otherUserFollower}
                    userFollower={userFollower.followerPeople}
                    openOtherProfileFromFollowerAndFollowingClick={
                      openOtherProfileFromFollowerAndFollowingClick
                    }
                    setOpenOtherUserFollower={setOpenOtherUserFollower}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="oprofileContainer">
          <div className="oprofileTopContainer">
            <div className="obackProfile"></div>
            <div className="oprofileNote">
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className="onoteIcon"
              />
            </div>
          </div>
          <div className="oprofilePhotoContainer">
            {coverPhoto.data ? (
              <img
                src={`data:${coverPhoto.contentType};base64, ${coverPhoto.data}`}
                className="ocoverPhoto"
              />
            ) : (
              <div className="oDefaultCoverPhoto"></div>
            )}
            <div className="oprofileAndEditContainer">
              <div className="oprofileAndActive">
                {profileImage.data ? (
                  <img
                    src={`data:${profileImage.contentType};base64, ${profileImage.data}`}
                    className="oprofilePhoto"
                  />
                ) : (
                  <img
                    src="/defaultProfileImage.png"
                    className="oprofilePhoto"
                  />
                )}
                <div className="oactiveIcon"></div>
              </div>
              <div className="followButtonContainer">
                {iAlreadyFollow ? (
                  <button className="followButton" onClick={unFollowOpenDelay}>
                    <FontAwesomeIcon
                      icon={faUserCheck}
                      className="followedCheckMark"
                    />
                    Followed
                  </button>
                ) : (
                  <button
                    className="followButton"
                    onClick={() => {
                      handelfollow("plus");
                      setUnfollowOpen(false);
                    }}
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="ouserNameContainer">
            <div className="ouserName">{userName}</div>
            <div className="ouserNameKey">{userNameKey}</div>
            <div className="ouserCaption">{userCaption}</div>
          </div>
          <div className="ofollowerContainer">
            <div className="ofollowerChild">
              <div
                className="ofollowerTag"
                onClick={() => {
                  setOpenOtherUserFollower(true);
                }}
              >
                <div className="ofollowerAmount">{userFollowerAmount}</div>
                <div className="ofollowerText">followers</div>
              </div>
              <div className="ofollowingTag">
                <div className="ofollowingAmount">{userFollowingAmount}</div>
                <div className="ofollowingText">following</div>
              </div>
              <div className="olikeTag">
                <div className="olikeAmount">{userLikes}</div>
                <div className="olikeText">Likes</div>
              </div>
            </div>
          </div>
          <div className="opostContainer">
            <div className="opostText">POST</div>

            {loadingPost ? (
              <LoadingPostCard />
            ) : (
              <>
                {randomPostData.length === 0 ? (
                  <div>{userName} don't have post</div>
                ) : (
                  <>
                    {randomPostData.map((postData, index) => (
                      <PostCard
                        key={index}
                        index={index}
                        postData={postData}
                        randomPostData={randomPostData}
                        openOtherProfileFromPostNameClick={
                          openOtherProfileFromPostNameClick
                        }
                        setReloadPostRequest={setReloadPostRequest}
                        reloadPostRequest={reloadPostRequest}
                        addToLocalCurrentCommentData={
                          addToLocalCurrentCommentData
                        }
                        removeLocalCurrentComment={removeLocalCurrentComment}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
          {unfollowOpen && (
            <div className="unFollowPageContainer">
              <div className="unFollowBoxContainer">
                <div className="unFollowAskText">
                  Do you want to unfollow
                  <span className="unFollowUserName">{userName}?</span>
                </div>
                <div className="unFollowButtonContainer">
                  <button
                    className="unFollowCancleButton"
                    onClick={() => setUnfollowOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="unFollowButton"
                    onClick={() => {
                      handelfollow("minus");
                      setUnfollowOpen(false);
                    }}
                  >
                    Unfollow
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
export default OtherProfile;
