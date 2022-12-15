import React from "react";
import "./likerTag.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { ApiUrls } from "../../api/ApiUrls";

const LikerTag = ({ eachLikerEmail, openOtherProfileFromPostNameClick }) => {
  const bufferToBase64String = async (buffer) => {
    let binary = "";
    let bytes = await [].slice.call(new Uint8Array(buffer));
    await bytes.forEach((each) => (binary += String.fromCharCode(each)));
    return window.btoa(binary);
  };

  const [likerName, setLikerName] = useState("");
  const [likerImage, setLikerImage] = useState({});
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function fetchLikerData() {
      try {
        const url = ApiUrls.apiUrl + ApiUrls.getUserDataUrl;
        const { data: res } = await axios.post(url, { email: eachLikerEmail });
        let likerData = res.userData;
        setUserData(likerData);

        //name
        let likerNameRaw = likerData.firstName + " " + likerData.lastName;
        setLikerName(likerNameRaw);

        //profileImage
        if (likerData.profileImage) {
          if (likerData.profileImage.data.data) {
            async function postDataPostImageDataData() {
              let base64PostImageObject = {};
              let base64PostImageString = await bufferToBase64String(
                likerData.profileImage.data.data
              );
              base64PostImageObject = {
                contentType: likerData.profileImage.contentType,
                data: base64PostImageString,
              };
              setLikerImage(base64PostImageObject);
            }
            postDataPostImageDataData();
          } else if (likerData.profileImage.data) {
            async function postDataPostImageData() {
              let base64PostImageObject = {};
              let base64PostImageStringData = await bufferToBase64String(
                likerData.profileImage.data
              );
              base64PostImageObject = {
                contentType: likerData.profileImage.contentType,
                data: likerData.profileImage.data,
              };
              setLikerImage(base64PostImageObject);
            }
            postDataPostImageData();
          } else {
            setLikerImage({});
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchLikerData();
  }, [eachLikerEmail]);
  return (
    <>
      <div
        className="likerTag"
        onClick={() => openOtherProfileFromPostNameClick(userData)}
      >
        <FontAwesomeIcon icon={faThumbsUp} className="likerReactIcon" />
        {likerImage.data ? (
          <img
            src={`data:${likerImage.contentType};base64, ${likerImage.data}`}
            className="likerImg"
          />
        ) : (
          <img src="/defaultProfileImage.png" className="likerImg" />
        )}
        <div className="likerName">{likerName}</div>
      </div>
    </>
  );
};
export default LikerTag;
