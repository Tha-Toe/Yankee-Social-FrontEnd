import React, { useEffect, useState } from "react";
import "./profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faCameraRotate,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import PostCard from "../home/PostCard";
import axios from "axios";

function Profile({
  setHomeOpen,
  setFollowerOpen,
  setProfileOpen,
  setNotiOpen,
  setBarOpen,
  setNavWidth,
  setNavLeft,
  setChangeSomething,
}) {
  const [tempoState, setTempoState] = useState({
    caption:
      "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies",
    img: "/testImg.jpg",
    like: "23",
    comment: "23",
    share: "13",
  });
  const userData = useSelector((state) => state.data.userData);
  const [userName, setUserName] = useState("");
  const [userNameKey, setUserNameKey] = useState("");
  const [userCaption, setUserCaption] = useState("");
  const [userFollower, setUserFollower] = useState("");
  const [userFollowerAmount, setUserFollowerAmount] = useState();
  const [userFollowing, setUserFollowing] = useState("");
  const [userFollowingAmount, setUserFollowingAmount] = useState();
  const [userLikes, setUserLikes] = useState("");
  const [userEmail, setUserEmail] = useState();
  const [profileImage, setProfileImage] = useState({});
  const [coverPhoto, setCoverPhoto] = useState({});

  useEffect(() => {
    if (userData.firstName) {
      let name = userData.firstName + " " + userData.lastName;
      setUserName(name);
      setUserFollower(userData.follower);
      if (userData.follower.followerPeople.length <= 0) {
        setUserFollowerAmount(0);
      } else {
        setUserFollowerAmount(userData.follower.followerPeople.length);
      }
      setUserFollowing(userData.following);
      if (userData.following.followingPeople.length <= 0) {
        setUserFollowingAmount(0);
      } else {
        setUserFollowingAmount(userData.following.followingPeople.length);
      }
      setUserCaption(userData.caption);
      setUserLikes(userData.likes);
      setUserNameKey(userData.nameKey);
      setUserEmail(userData.email);
      /*
      const arrayBufferToBase64 = (buffer) => {
        var binary = "";
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        return window.btoa(binary);
      };
      let base64Console = arrayBufferToBase64(userData.profileImage.data.data);
      setProfileImage({ ...userData.profileImage, data: base64Console });
*/
      setProfileImage(userData.profileImage);
      setCoverPhoto(userData.coverPhoto);
    }
  }, [userData]);

  const handleBack = () => {
    setHomeOpen(true);
    setFollowerOpen(false);
    setProfileOpen(false);
    setNotiOpen(false);
    setBarOpen(false);
    setNavLeft("0px");
  };

  //uploadProfileImage
  const [clickProfileCameraIcon, setClickProfileCameraIcon] = useState(false);
  const [profilePreview, setProfilePreview] = useState();
  const [formData, setFormData] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const selectProfilePicture = (e) => {
    setFormData("");
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfilePreview(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
    let data = new FormData();
    data.append("profile_pic", e.target.files[0]);
    data.append("name", e.target.files.name);
    data.append("email", userEmail);
    setFormData(data);
  };

  const handleUploadProfileImage = async (e) => {
    e.preventDefault();
    try {
      setProfilePreview("");
      setUploadLoading(true);
      const url = "http://localhost:3001/api/uploadprofileimage";
      const { data: res } = await axios.post(url, formData, {
        email: userEmail,
      });
      setUploadLoading(false);
      setClickProfileCameraIcon(false);
      setChangeSomething(true);
      //window.location = "/";
    } catch (error) {
      if (error) {
        setUploadLoading(false);
        setErrorMessage(error.response.data.message);
        console.log(error);
      }
    }
  };

  //uploadCoverPhoto
  const [clickCoverCameraIcon, setClickCoverCameraIcon] = useState(false);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState("");
  const selectCoverPhoto = (e) => {
    setFormData("");
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setCoverPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
    let data = new FormData();
    data.append("cover_photo", e.target.files[0]);
    data.append("name", e.target.files.name);
    data.append("email", userEmail);
    setFormData(data);
  };
  const handleUploadCoverPhoto = async (e) => {
    e.preventDefault();
    try {
      setUploadLoading(true);
      setCoverPhotoPreview("");
      const url = "http://localhost:3001/api/uploadcoverphoto";
      const { data: res } = await axios.post(url, formData, {
        email: userEmail,
      });
      setClickCoverCameraIcon(false);
      setUploadLoading(false);
      setChangeSomething(true);
      //window.location = "/";
    } catch (error) {
      setUploadLoading(false);
      setErrorMessage(error.response.data.message);
    }
  };

  //edit profile
  const [clickEditProfile, setClickEditProfile] = useState(false);

  return (
    <div className="profileContainer">
      <div className="profileTopContainer">
        <div className="backProfile">
          <FontAwesomeIcon
            icon={faArrowLeftLong}
            className="backIcon"
            onClick={handleBack}
          />
        </div>
        <div className="profileNote">
          <FontAwesomeIcon icon={faEllipsisVertical} className="noteIcon" />
        </div>
      </div>
      <div className="profilePhotoContainer">
        <div className="changeCoverPhotoIconContainer">
          <FontAwesomeIcon
            icon={faCameraRotate}
            className="changeCoverPhotoIcon"
            onClick={setClickCoverCameraIcon}
          />
        </div>
        {coverPhoto.data ? (
          <img
            src={`data:${coverPhoto.contentType};base64, ${coverPhoto.data}`}
            className="coverPhoto"
          />
        ) : (
          <div className="coverDefault"></div>
        )}
        <div className="profileAndEditContainer">
          <div className="profileAndActive">
            {profileImage.data && profileImage.contentType ? (
              <img
                src={`data:${profileImage.contentType};base64, ${
                  /*profileImage.data.data.toString("base64")*/ profileImage.data
                }`}
                className="profilePhoto"
              />
            ) : (
              <img src="/defaultProfileImage.png" className="profilePhoto" />
            )}
            <div
              className="uploadProfileIconContainer"
              onClick={() => setClickProfileCameraIcon(true)}
            >
              <FontAwesomeIcon
                icon={faCameraRotate}
                className="uploadProfileIcon"
              />
            </div>
          </div>
          <button
            className="editButton"
            onClick={() => setClickEditProfile(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>
      {clickProfileCameraIcon && (
        <form
          className="uploadProfileImageContainer"
          encType="multipart/form-data"
          onSubmit={handleUploadProfileImage}
        >
          <div className="uploadProfileCard">
            <div className="lableAndInputContainer">
              <label className="profile_pic">Select Profile Picture</label>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                name="profile_pic"
                className={`${"foo"} ${uploadLoading && "opacityHide"}`}
                onChange={selectProfilePicture}
              />
            </div>
            {profilePreview ? (
              <img src={profilePreview} className="previewProfile" />
            ) : (
              ""
            )}
            {uploadLoading && (
              <div className="loadingText">
                Please wait, uploading Profile Picture...
              </div>
            )}
            {errorMessage && <div>{errorMessage}</div>}
            <div className="uploadButtonContainer">
              <button
                className="cancleUploadButton"
                onClick={() => {
                  setClickProfileCameraIcon(false);
                  setProfilePreview("");
                }}
              >
                Cancle
              </button>
              {profilePreview ? (
                <button className="uploadButton" type="submit">
                  Upload Profile Picture
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </form>
      )}
      {clickCoverCameraIcon && (
        <form
          className="uploadCoverPhotoContainer"
          encType="multipart/form-data"
          onSubmit={handleUploadCoverPhoto}
        >
          <div className="uploadCoverPhotoCard">
            <div className="lableAndInputContainer">
              <label className="cover_photo">Select Cover Photo</label>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                name="profile_pic"
                className={`${"cfoo"} ${uploadLoading && "opacityHide"}`}
                onChange={selectCoverPhoto}
              />
            </div>
            {coverPhotoPreview ? (
              <img src={coverPhotoPreview} className="previewCoverPhoto" />
            ) : (
              ""
            )}
            {uploadLoading && (
              <div className="loadingText">
                Please wait, uploading Cover Photo...
              </div>
            )}
            {errorMessage && <div>{errorMessage}</div>}
            <div className="uploadButtonContainer">
              <button
                className="cancleUploadButton"
                onClick={() => {
                  setClickCoverCameraIcon(false);
                  setCoverPhotoPreview("");
                }}
              >
                Cancle
              </button>
              {coverPhotoPreview ? (
                <button className="uploadButton" type="submit">
                  Upload Cover Photo
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </form>
      )}
      {clickEditProfile && (
        <div className="editContainer">
          <div className="editCard">
            <div
              className="changeProfilePicture"
              onClick={() => {
                setClickProfileCameraIcon(true);
                setClickEditProfile(false);
              }}
            >
              Change Profile Picture
            </div>
            <div
              className="changeProfilePicture"
              onClick={() => {
                setClickCoverCameraIcon(true);
                setClickEditProfile(false);
              }}
            >
              Change Cover Photo
            </div>
          </div>
          <button
            className="cancelEditButton"
            onClick={() => setClickEditProfile(false)}
          >
            Cancle
          </button>
        </div>
      )}
      <div className="userNameContainer">
        <div className="userName">{userName}</div>
        <div className="userNameKey">{userNameKey}</div>
        <div className="userCaption">{userCaption}</div>
      </div>
      <div className="followerContainer">
        <div className="followerChild">
          <div className="followerTag">
            <div className="followerAmount">{userFollowerAmount}</div>
            <div className="followerText">followers</div>
          </div>
          <div className="followingTag">
            <div className="followingAmount">{userFollowingAmount}</div>
            <div className="followingText">following</div>
          </div>
          <div className="likeTag">
            <div className="likeAmount">{userLikes}</div>
            <div className="likeText">Likes</div>
          </div>
        </div>
      </div>
      <div className="postContainer">
        <div className="postText">POST</div>
        <PostCard tempoState={tempoState} />
        <PostCard tempoState={tempoState} />
        <PostCard tempoState={tempoState} />
      </div>
    </div>
  );
}
export default Profile;
