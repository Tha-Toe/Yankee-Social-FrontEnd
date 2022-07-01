import axios from "axios";
import React, { useEffect, useState } from "react";
import "./otherUserFollowerList.scss";

const OtherUserFollowerList = ({
  otherUserFollower,
  userFollower,
  openOtherProfileFromFollowerAndFollowingClick,
  setOpenOtherUserFollower,
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
    //console.log("It's run" + otherUserFollower);
    setDataForOtherProfile();
    setUserName("");
    setUserProfileImage({});
    setOtherUserEmail("");
    setLoadedData(true);
    async function fetchFunction() {
      const url = "http://localhost:3001/api/search";
      const { data: res } = await axios.post(url, {
        followerEmail: otherUserFollower,
      });
      //console.log(res.followingPeopleData);
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

    fetchFunction();
  }, [otherUserFollower, userFollower]);

  //pop unfollowButton
  const [hiddenButton, setHiddenButton] = useState(false);
  return (
    <>
      {loadedData ? (
        <div className="lloadFollowingContainer">Loading...</div>
      ) : (
        <>
          <div className="lfingcContainer">
            <div className="lfingcImgAndNameContainer">
              {userProfileImage.data ? (
                <img
                  src={`data:${userProfileImage.contentType};base64, ${userProfileImage.data}`}
                  alt=""
                  className="lfingcImg"
                />
              ) : (
                <img
                  src="/defaultProfileImage.png"
                  alt=""
                  className="lfingcImg"
                />
              )}
              <div
                className="lfingcName"
                onClick={() => {
                  openOtherProfileFromFollowerAndFollowingClick(
                    dataForOtherProfile
                  );
                  setOpenOtherUserFollower(false);
                }}
              >
                {userName}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OtherUserFollowerList;
