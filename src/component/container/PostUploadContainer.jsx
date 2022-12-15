import React from "react";
import "./postUploadContainer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faImages } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { ApiUrls } from "../../api/ApiUrls";

const PostUploadContainer = ({ setOpenPostUploadPage }) => {
  const userData = useSelector((state) => state.data.userData);
  const [userName, setUserName] = useState();
  const [userProfile, setUserProfile] = useState({});
  const [userEmail, setUserEmail] = useState();
  useEffect(() => {
    if (userData) {
      let name = userData.firstName + " " + userData.lastName;
      setUserName(name);
      setUserProfile(userData.profileImage);
      setUserEmail(userData.email);
    }
  }, [userData]);

  //post data
  const [userCaption, setUserCaption] = useState("");
  //const [formData, setFormData] = useState();
  const [photoPreview, setPhotoPreview] = useState();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [photoFile0, setPhotoFile0] = useState();
  const [photoFileName, setPhotoFileName] = useState();

  const handelSelectPhoto = (e) => {
    //setFormData("");
    if (e.target.files[0] === undefined) {
      return;
    } else {
      //console.log(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPhotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
      setPhotoFile0(e.target.files[0]);
      setPhotoFileName(e.target.files.name);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (userCaption || photoPreview) {
      let data = new FormData();
      data.append("post_pic", photoFile0);
      data.append("name", photoFileName);
      data.append("caption", userCaption);
      data.append("email", userEmail);
      //setFormData(data);

      try {
        //await setFormData(data);
        setPhotoPreview("");
        setUploadLoading(true);

        const url = ApiUrls.apiUrl + ApiUrls.uploadPostUrl;
        const { data: res } = await axios.post(url, data);
        setUploadLoading(false);
        setOpenPostUploadPage(false);
        //setFormData("");
      } catch (error) {
        setUploadLoading(false);
        //setErrorMessage(error.response.data.message);
      }
    } else {
      return;
    }
  };
  const handelChange = (e) => {
    setUserCaption(e.target.value);
  };
  return (
    <form encType="multipart/form-data" onSubmit={handlePost}>
      <div className="postUploadPageContainer">
        {uploadLoading ? (
          <div className="postUploadLoading">Post uploading Please Wait...</div>
        ) : (
          <>
            <div className="postUploadPageChild">
              <div className="postUploadtopContainer">
                <div className="headerPostUploadPage">
                  <div className="leftHeader">
                    <FontAwesomeIcon
                      icon={faArrowLeftLong}
                      onClick={() => {
                        setOpenPostUploadPage(false);
                      }}
                      className="backPostUploadPage"
                    />
                    <div className="headerText">Create Post</div>
                  </div>
                  <div className="rightHeader">
                    <button className="postUploadButton" type="submit">
                      POST
                    </button>
                  </div>
                </div>
                <div className="npPostUploadContainer">
                  {userProfile.data && userProfile.contentType ? (
                    <img
                      src={`data:${userProfile.contentType};base64, ${userProfile.data}`}
                      className="myProfileImage"
                    />
                  ) : (
                    <img
                      src="/defaultProfileImage.png"
                      className="myProfileImage"
                    />
                  )}

                  <div className="myName">{userName}</div>
                </div>
                <textarea
                  type="text"
                  name="caption"
                  className="captionInputTag"
                  placeholder="What's on your mind?"
                  rows="4"
                  onChange={handelChange}
                ></textarea>
                {photoPreview ? (
                  <img src={photoPreview} className="previewPhoto" />
                ) : (
                  ""
                )}
              </div>
              <div className="bottomPhotoSelectBar"></div>
              <div className="bottomPhotoSelectBar">
                <FontAwesomeIcon icon={faImages} className="bottonPhotoIcon" />
                {/*<div className="bottomText">Select Photo</div>*/}
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  name="post_pic"
                  className="foo"
                  onChange={handelSelectPhoto}
                  //onChange={selectProfilePicture}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
};
export default PostUploadContainer;
