import React from "react";
import "./suggest.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";

const SuggestCard = ({
  suggestEmail,
  suggestEmailList,
  unfollowFunction,
  alreadyFollowHideFollowButton,
  openOtherProfileFromFollowerAndFollowingClick,
  setOtherProfileOpen,
  temporaryPopSuggestEmail,
  refreshMap,
}) => {
  const [loadedData, setLoadedData] = useState(true);
  const arrayBufferToBase64 = async (buffer) => {
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    await bytes.forEach((each) => (binary += String.fromCharCode(each)));
    return window.btoa(binary);
  };
  const [dataForOtherProfile, setDataForOtherProfile] = useState();
  const [userName, setUserName] = useState("");
  const [userProfileImage, setUserProfileImage] = useState();
  const [otherUserEmail, setOtherUserEmail] = useState();

  useEffect(() => {
    setDataForOtherProfile();
    setUserName("");
    setUserProfileImage();
    setOtherUserEmail();
    setLoadedData(true);
    async function followerDataFetchFunction() {
      const url = "http://localhost:3001/api/search";
      const { data: res } = await axios.post(url, {
        suggestEmail: suggestEmail.email,
      });
      //console.log("start");
      let suggestPeopleData = await res.suggestPeopleData;
      setDataForOtherProfile(suggestPeopleData);
      setUserName(
        suggestPeopleData.firstName + " " + suggestPeopleData.lastName
      );
      setOtherUserEmail(suggestPeopleData.email);
      if (suggestPeopleData.profileImage) {
        suggestPeopleData.profileImage.data = await arrayBufferToBase64(
          suggestPeopleData.profileImage.data.data
        );
        setUserProfileImage(suggestPeopleData.profileImage);
      }
      setLoadedData(false);
      //console.log(followerPeopleData);
    }
    followerDataFetchFunction();
  }, [suggestEmail, suggestEmailList, refreshMap]);
  const [hiddenButton, setHiddenButton] = useState(false);

  return (
    <>
      {loadedData ? (
        <div className="loadFollowingContainer">Loading...</div>
      ) : (
        <>
          <div className="scContainer">
            <div className="scImgAndNameContainer">
              {userProfileImage ? (
                <img
                  src={`data:${userProfileImage.contentType};base64, ${userProfileImage.data}`}
                  alt=""
                  className="scImg"
                />
              ) : (
                <img src="/defaultProfileImage.png" alt="" className="scImg" />
              )}
              <div
                className="scName"
                onClick={() => {
                  setOtherProfileOpen(true);
                  openOtherProfileFromFollowerAndFollowingClick(
                    dataForOtherProfile
                  );
                }}
              >
                {userName}
              </div>
            </div>
            {!alreadyFollowHideFollowButton && (
              <div className="buttonContainer">
                {!hiddenButton && (
                  <button
                    className="scButton"
                    onClick={() => {
                      unfollowFunction(otherUserEmail);
                      temporaryPopSuggestEmail(otherUserEmail);
                    }}
                  >
                    Follow
                  </button>
                )}
                <button
                  className="scDeleteButton"
                  onClick={() => {
                    temporaryPopSuggestEmail(otherUserEmail);
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SuggestCard;
