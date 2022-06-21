import React, { useEffect, useState } from "react";
import "./home.scss";
import PostCard from "./PostCard";
import { useSelector } from "react-redux";

function Home() {
  const [tempoState, setTempoState] = useState({
    caption:
      "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies",
    img: "/testImg.jpg",
    like: "23",
    comment: "23",
    share: "13",
  });

  //profileImage
  const [userProfileImage, setUserProfileImage] = useState();
  const userData = useSelector((state) => state.data.userData);
  useEffect(() => {
    if (userData.profileImage.data) {
      setUserProfileImage(userData.profileImage);
      //      console.log(userData.profileImage);
    }
  }, [userData]);

  return (
    <div className="homeContainer">
      <div className="postUploadContainer">
        <div className="profileImageContainer">
          {userProfileImage ? (
            <img
              src={`data:${userProfileImage.contentType};base64, ${userProfileImage.data}`}
              className="profileImage"
            />
          ) : (
            <img src="/defaultProfileImage.png" className="profileImage" />
          )}
        </div>
        <div className="inputTagContainer">
          <input
            className="inputTag"
            placeholder="What is on your mind?"
            type="text"
          />
        </div>
      </div>
      <div className="postContainer">
        <PostCard tempoState={tempoState} />
        <PostCard tempoState={tempoState} />
        <PostCard tempoState={tempoState} />
      </div>
    </div>
  );
}
export default Home;
