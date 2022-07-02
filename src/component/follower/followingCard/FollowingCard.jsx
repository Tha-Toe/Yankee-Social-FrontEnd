import axios from "axios";
import React, { useEffect, useState } from "react";
import "./followingCard.scss";

const FollowingCard = ({
  followingEmail,
  followingEmailList,
  unfollowFunction,
  openOtherProfileFromFollowerAndFollowingClick,
  setOtherProfileOpen,
  temporaryPopEmail,
  refreshMap,
}) => {
  //loadingCard
  const [loadedData, setLoadedData] = useState(true);
  const arrayBufferToBase64 = async (buffer) => {
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    await bytes.forEach((each) => (binary += String.fromCharCode(each)));
    return window.btoa(binary);
  };
  //axios post data
  const [dataForOtherProfile, setDataForOtherProfile] = useState();
  const [userName, setUserName] = useState("");
  const [userProfileImage, setUserProfileImage] = useState();
  const [otherUserEmail, setOtherUserEmail] = useState();

  useEffect(() => {
    setDataForOtherProfile();
    setUserName("");
    setUserProfileImage({});
    setOtherUserEmail("");
    setLoadedData(true);
    async function fetchFunction() {
      const url = "https://yankee-server.herokuapp.com/api/search";
      const { data: res } = await axios.post(url, {
        followingEmail: followingEmail,
      });
      let followingPeopleData = await res.followingPeopleData;
      setDataForOtherProfile(followingPeopleData);
      setUserName(
        followingPeopleData.firstName + " " + followingPeopleData.lastName
      );
      setOtherUserEmail(followingPeopleData.email);
      let base64ProfileImageData;
      let contentTypeFromSuggestPeopleData;
      if (followingPeopleData.profileImage) {
        base64ProfileImageData = await arrayBufferToBase64(
          followingPeopleData.profileImage.data.data
        );
        contentTypeFromSuggestPeopleData =
          followingPeopleData.profileImage.contentType;
        setUserProfileImage({
          data: base64ProfileImageData,
          contentType: contentTypeFromSuggestPeopleData,
        });
      }
      setLoadedData(false);
      //console.log(followingPeopleData);
    }

    fetchFunction();
  }, [followingEmail, followingEmailList]);

  //pop unfollowButton
  const [hiddenButton, setHiddenButton] = useState(false);
  return (
    <>
      {loadedData ? (
        <div className="loadFollowingContainer">Loading...</div>
      ) : (
        <>
          {!hiddenButton && (
            <div className="fingcContainer">
              <div className="fingcImgAndNameContainer">
                {userProfileImage.data ? (
                  <img
                    src={`data:${userProfileImage.contentType};base64, ${userProfileImage.data}`}
                    alt=""
                    className="fingcImg"
                  />
                ) : (
                  <img
                    src="/defaultProfileImage.png"
                    alt=""
                    className="fingcImg"
                  />
                )}
                <div
                  className="fingcName"
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
              <button
                className="fingcButton"
                onClick={() => {
                  unfollowFunction(otherUserEmail);
                  temporaryPopEmail(otherUserEmail);
                  //setHiddenButton(true);
                }}
              >
                Unfollow
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FollowingCard;
