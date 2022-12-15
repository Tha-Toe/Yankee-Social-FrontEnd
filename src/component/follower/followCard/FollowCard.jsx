import React from "react";
import "./followCard.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { ApiUrls } from "../../../api/ApiUrls";

const FollowCard = ({
  followerEmail,
  unfollowFunction,
  alreadyFollowHideFollowButton,
  openOtherProfileFromFollowerAndFollowingClick,
  setOtherProfileOpen,
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
  const [userProfileImage, setUserProfileImage] = useState({});
  const [otherUserEmail, setOtherUserEmail] = useState();

  useEffect(() => {
    async function followerDataFetchFunction() {
      const url = ApiUrls.apiUrl + ApiUrls.searchUrl;
      const { data: res } = await axios.post(url, {
        followerEmail: followerEmail,
      });
      let followerPeopleData = await res.followerPeopleData;
      setDataForOtherProfile(followerPeopleData);
      setUserName(
        followerPeopleData.firstName + " " + followerPeopleData.lastName
      );
      setOtherUserEmail(followerPeopleData.email);
      let base64ProfileImageData;
      let contentTypeFromSuggestPeopleData;
      if (followerPeopleData.profileImage) {
        base64ProfileImageData = await arrayBufferToBase64(
          followerPeopleData.profileImage.data.data
        );
        contentTypeFromSuggestPeopleData =
          followerPeopleData.profileImage.contentType;
        setUserProfileImage({
          data: base64ProfileImageData,
          contentType: contentTypeFromSuggestPeopleData,
        });
      }
      setLoadedData(false);
      //console.log(followerPeopleData);
    }
    followerDataFetchFunction();
  }, [followerEmail]);
  const [hiddenButton, setHiddenButton] = useState(false);

  return (
    <>
      {loadedData ? (
        <div className="loadFollowingContainer">Loading...</div>
      ) : (
        <>
          <div className="fcContainer">
            <div className="fcImgAndNameContainer">
              {userProfileImage.data ? (
                <img
                  src={`data:${userProfileImage.contentType};base64, ${userProfileImage.data}`}
                  alt=""
                  className="fcImg"
                />
              ) : (
                <img src="/defaultProfileImage.png" alt="" className="fcImg" />
              )}
              <div
                className="fcName"
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
              <>
                {!hiddenButton && (
                  <button
                    className="fcButton"
                    onClick={() => {
                      unfollowFunction(otherUserEmail);
                      setHiddenButton(true);
                    }}
                  >
                    Follow
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default FollowCard;
