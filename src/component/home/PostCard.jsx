import React, { useRef } from "react";
import "./postCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faThumbsUp,
  faMessage,
  faShare,
  faXmark,
  faTrashCan,
  faBucket,
  faBug,
  faArrowLeftLong,
  faPaperPlane,
  faCommentSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import LikerTag from "./LikerTag";
import Comment from "./Comment";
import { ApiUrls } from "../../api/ApiUrls";

function PostCard({
  postData,
  randomPostData,
  openOtherProfileFromPostNameClick,
  index,
  reloadPostRequest,
  addToLocalCurrentCommentData,
  removeLocalCurrentComment,
}) {
  const [postImage, setPostImage] = useState({});

  const arrayBufferToBase64 = async (buffer) => {
    let binary = "";
    let bytes = await [].slice.call(new Uint8Array(buffer));
    await bytes.forEach((each) => (binary += String.fromCharCode(each)));
    return window.btoa(binary);
  };

  const [timeAgo, setTimeAgo] = useState("");
  const [_id, set_id] = useState("");
  const [postOwnerEmail, setPostOwnerEmail] = useState("");
  const [postIndex, setPostIndex] = useState("");
  useEffect(() => {
    const bufferToBase64Function = async () => {
      //postIndex
      setPostIndex(index);
      //post owner email
      setPostOwnerEmail(postData.ownerEmail);
      //post upload time
      const uploadSeconds = postData.uploadTime.uploadSeconds;
      const uploadDate = postData.uploadTime.uploadDate;
      const currDate = new Date();
      const currTime = currDate.getTime();
      const differentTime = currTime - uploadSeconds;
      if (differentTime < 3600000) {
        //minutes
        let secondsOfMinutes = differentTime / 1000;
        let minutes;
        if (secondsOfMinutes <= 60) {
          minutes = 1;
          setTimeAgo(1 + " min ago");
        } else {
          minutes = Math.floor(secondsOfMinutes / 60);
          setTimeAgo(minutes + " min ago");
        }
      } else if (differentTime < 86400000) {
        //hours
        let secondsOfHours = differentTime / 1000;
        let hours = Math.floor(secondsOfHours / 3600);
        setTimeAgo(hours + " hr ago");
      } else if (differentTime < 604800000) {
        /// 7 day
        let secondsOfDays = differentTime / 1000;
        let days = Math.floor(secondsOfDays / 86400);
        setTimeAgo(days + " days ago");
      } else {
        setTimeAgo(uploadDate);
      }
      //id
      set_id(postData._id);
      //profileImage
      setPostImage({});
      if (postData.postImage) {
        if (postData.postImage.data.data) {
          async function postDataPostImageDataData() {
            let base64PostImageObject = {};
            let base64PostImageString = await arrayBufferToBase64(
              postData.postImage.data.data
            );
            base64PostImageObject = {
              contentType: postData.postImage.contentType,
              data: base64PostImageString,
            };
            setPostImage(base64PostImageObject);
          }
          postDataPostImageDataData();
        } else if (postData.postImage.data) {
          async function postDataPostImageData() {
            let base64PostImageObject = {};
            let base64PostImageStringData = await arrayBufferToBase64(
              postData.postImage.data
            );
            base64PostImageObject = {
              contentType: postData.postImage.contentType,
              data: postData.postImage.data,
            };
            setPostImage(base64PostImageObject);
          }
          postDataPostImageData();
        } else {
          setPostImage({});
        }
      }
    };
    bufferToBase64Function();
  }, [randomPostData, postData]);

  //userData
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState({});
  const [userData, setUserData] = useState();
  const [itIsMyPost, setItIsMyPost] = useState(false);
  const myEmail = useSelector((state) => state.data.userData.email);

  useEffect(() => {
    async function getUserData() {
      const url = ApiUrls.apiUrl + ApiUrls.getUserDataUrl;
      const { data: res } = await axios.post(url, {
        email: postData.ownerEmail,
      });
      setUserData(res.userData);
      let calculateUserName =
        res.userData.firstName + " " + res.userData.lastName;
      setUserName(calculateUserName);

      //myPost?condition
      if (res.userData.email === myEmail) {
        setItIsMyPost(true);
      } else {
        setItIsMyPost(false);
      }
      //profileImage?condition
      if (res.userData.profileImage) {
        let base64ProfileImageString = await arrayBufferToBase64(
          res.userData.profileImage.data.data
        );
        let base64ProfileImageObject = {
          contentType: res.userData.profileImage.contentType,
          data: base64ProfileImageString,
        };
        setProfileImage(base64ProfileImageObject);
      } else {
        setProfileImage({});
      }
    }
    getUserData();
  }, [randomPostData, postData]);

  //delete post function
  const [openEditPost, setOpenEditPost] = useState(false);
  const handelDeletePost = async () => {
    let _id = postData._id;
    const url = ApiUrls.apiUrl + ApiUrls.deletePostUrl;
    const { data: res } = await axios.post(url, { _id: _id });
    reloadPostRequest(index);
    setOpenEditPost(false);
  };

  //like post
  const [likedPost, setLikedPost] = useState(false);
  const [likedList, setLikedList] = useState([]);
  useEffect(() => {
    //like list add
    if (postData.like) {
      setLikedList(postData.like);
    }
    //check already liked?
    async function likeValidate() {
      let indexOfLikeArray = await postData.like.indexOf(myEmail);
      if (indexOfLikeArray >= 0) {
        setLikedPost(true);
      } else {
        setLikedPost(false);
      }
    }
    likeValidate();
  }, [postData]);

  //click like button delay to server
  const [delayButton, setDelayButton] = useState(false);

  const likePost = async () => {
    //local post adjust
    setLikedPost(true);
    setDelayButton(true);
    const likedListClone = likedList;
    const indexOfValidInLocalPost = likedListClone.indexOf(myEmail);
    if (indexOfValidInLocalPost === -1) {
      likedListClone.push(myEmail);
      setLikedList(likedListClone);
    }
    //server post adjust
    try {
      const url = ApiUrls.apiUrl + ApiUrls.likePostUrl;
      const { data: res } = await axios.post(url, {
        _id: _id,
        like: "like",
        userEmail: myEmail,
      });
      setDelayButton(false);
    } catch (error) {
      console.log(error);
    }
  };
  const unlikePost = async () => {
    setLikedPost(false);
    setDelayButton(true);
    //local post adjust
    const likedListClone = likedList;
    const indexOfValidInLocalPost = likedListClone.indexOf(myEmail);
    if (indexOfValidInLocalPost >= 0) {
      likedListClone.splice(indexOfValidInLocalPost, 1);
      setLikedList(likedListClone);
    }
    //server post adjust
    try {
      const url = ApiUrls.apiUrl + ApiUrls.likePostUrl;
      const { data: res } = await axios.post(url, {
        _id: _id,
        unLike: "unlike",
        userEmail: myEmail,
      });
      setDelayButton(false);
    } catch (error) {
      console.log(error);
    }
  };
  const waitDelay = () => {
    return;
  };

  //open who like my post
  const [openWhoLikeMyPost, setOpenWhoLikeMyPost] = useState(false);

  //comment

  const [commentList, setCommentList] = useState([]);
  const [openCommentPage, setOpenCommentPage] = useState(false);
  const commentInputRef = useRef(null);

  useEffect(() => {
    setCommentList(postData.comment);
  }, [postData, randomPostData]);

  //send comment to database

  const [currentComment, setCurrentComment] = useState("");
  const [delayCommentUploadButton, setDelayCommentUploadButton] =
    useState(false);
  const handleAddCurrComment = (e) => {
    setCurrentComment(e.target.value);
  };
  const handleUploadComment = async () => {
    if (!currentComment) {
      return;
    } else {
      setDelayCommentUploadButton(true);
      try {
        const url = ApiUrls.apiUrl + ApiUrls.uploadCommentUrl;
        const { data: res } = await axios.post(url, {
          commentText: currentComment,
          commentOwner: myEmail,
          _id: _id,
        });
        let currTime = new Date();
        let uploadSeconds = currTime.getTime();
        let uploadDate = currTime.toLocaleDateString();

        const objectToAddCurrentCommentData = {
          commentOwner: myEmail,
          commentText: currentComment,
          commentUploadTime: {
            uploadSeconds: uploadSeconds,
            uploadDate: uploadDate,
          },
        };
        addToLocalCurrentCommentData({
          objectToAddCurrentCommentData: objectToAddCurrentCommentData,
          index: index,
        });
        setCurrentComment("");
        commentInputRef.current.value = "";
        setDelayCommentUploadButton(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  //local comment deleteFunction
  const removeLocalCurrentCommentInPostCard = async (e) => {
    console.log(e);
    let commentListRaw = commentList;
    commentListRaw.splice(e, 1);
    setCommentList([...commentListRaw]);
    console.log(commentListRaw);
  };

  if (!userData) {
    return <></>;
  }
  return (
    <div className="postCardContainer">
      <div className="postCardChild">
        {openEditPost && (
          <div className="editPostContainer">
            <FontAwesomeIcon
              icon={faXmark}
              className="cancelEditButton"
              onClick={() => {
                setOpenEditPost(false);
              }}
            />
            <div className="editPostChild">
              {itIsMyPost && (
                <div className="editPostTag" onClick={handelDeletePost}>
                  <FontAwesomeIcon icon={faTrashCan} className="iconFromEdit" />
                  Delete Post
                </div>
              )}
              <div className="editPostTag">
                <FontAwesomeIcon icon={faBug} className="iconFromEdit" />
                Report Post
              </div>
            </div>
          </div>
        )}
        <div className="postHeader">
          <div className="nameContainer">
            <div className="postProfileImageContainer">
              {profileImage.data ? (
                <img
                  src={`data:${profileImage.contentType};base64, ${profileImage.data}`}
                  className="pfImage"
                />
              ) : (
                <img src="/defaultProfileImage.png" className="pfImage" />
              )}
            </div>
            <div className="postProfileName">
              <div
                className="postName"
                onClick={() => {
                  openOtherProfileFromPostNameClick(userData);
                }}
              >
                {userName}
              </div>
              <div className="postHour">{timeAgo}</div>
            </div>
          </div>
          <div className="postEditContainer">
            <FontAwesomeIcon
              icon={faEllipsis}
              className="postEditIcon"
              onClick={() => {
                setOpenEditPost(true);
              }}
            />
          </div>
        </div>
        <div className="postDetail">
          <div className="postCaption">{postData.caption}</div>
        </div>
        {postImage.data && (
          <div className="postImageContainer">
            <img
              src={`data:${postImage.contentType};base64, ${postImage.data}`}
              className="postImage"
            />
          </div>
        )}
        <div className="postBottom">
          <div className="amountContainer">
            <div className="reactionContainer">
              {postData.like && (
                <>
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="reactionIcon"
                    onClick={() => {
                      setOpenWhoLikeMyPost(true);
                    }}
                  />
                  <div
                    className="reactionAmount"
                    onClick={() => {
                      setOpenWhoLikeMyPost(true);
                    }}
                  >
                    {likedList.length}
                  </div>
                </>
              )}
            </div>
            <div className="commentAndShareContainer">
              {postData.comment && (
                <div
                  className="commentAmount"
                  onClick={() => setOpenCommentPage(true)}
                >
                  {commentList.length} comments
                </div>
              )}
              {postData.share && (
                <div className="shareAmount">
                  {postData.share.length} shares
                </div>
              )}
            </div>
          </div>
          <div className="likeShareCommentContainer">
            <div className="likeShareCommentChild">
              {likedPost ? (
                <div
                  className={`${"lcsContainer"} ${likedPost ? "lcsLiked" : ""}`}
                  onClick={() => {
                    delayButton ? waitDelay() : unlikePost();
                  }}
                >
                  <FontAwesomeIcon icon={faThumbsUp} className="lcsIcon" />
                  <div className="lcsText">Like</div>
                </div>
              ) : (
                <div
                  className={`${"lcsContainer"} ${likedPost ? "lcsLiked" : ""}`}
                  onClick={() => {
                    delayButton ? waitDelay() : likePost();
                  }}
                >
                  <FontAwesomeIcon icon={faThumbsUp} className="lcsIcon" />
                  <div className="lcsText">Like</div>
                </div>
              )}
              <div
                className="lcsContainer"
                onClick={() => setOpenCommentPage(true)}
              >
                <FontAwesomeIcon icon={faMessage} className="lcsIcon" />
                <div className="lcsText">Comment</div>
              </div>
              {/*
              <div className="lcsContainer">
                <FontAwesomeIcon icon={faShare} className="lcsIcon" />
                <div className="lcsText">Share</div>
              </div>
*/}
            </div>
          </div>
        </div>
        {openWhoLikeMyPost && (
          <div className="wlmpContainer">
            <div className="whoLikeMyPostContainer">
              <div className="wlmpHeader">
                <FontAwesomeIcon
                  icon={faArrowLeftLong}
                  className="cancelOpenLikeIcon"
                  onClick={() => {
                    setOpenWhoLikeMyPost(false);
                  }}
                />
                <div className="totalLikeContainer">
                  <div className="totalLikeTag">Like -</div>
                  <div className="totalLikeAmount"> {likedList.length}</div>
                </div>
              </div>
              {likedList.length === 0 ? (
                <div className="noLikeTag">
                  <div className="noLikeText">No One Like</div>
                </div>
              ) : (
                <div className="likerListContainer">
                  {likedList.map((eachLikerEmail) => (
                    <LikerTag
                      eachLikerEmail={eachLikerEmail}
                      openOtherProfileFromPostNameClick={
                        openOtherProfileFromPostNameClick
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {openCommentPage && (
          <div className="commentContainer">
            <div className="commentChildContainer">
              <div className="backAndLikeAmountContainer">
                <FontAwesomeIcon
                  icon={faArrowLeftLong}
                  className="commentBackIcon"
                  onClick={() => setOpenCommentPage(false)}
                />
                <div className="commentHeader">{userName}'s post Comment</div>
                <div
                  className="likeAmountAndLikeIcon"
                  onClick={() => {
                    setOpenCommentPage(false);
                    setOpenWhoLikeMyPost(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="likeIconInComment"
                  />
                  <div className="likeAmountInComment">{likedList.length}</div>
                </div>
              </div>
              <div className="commentListContainer">
                <div className="commentListChildContainer">
                  {commentList.length === 0 ? (
                    <div className="noCommentContainer">
                      <FontAwesomeIcon
                        icon={faCommentSlash}
                        className="noCommentIcon"
                      />
                      <div className="noCommentText">No Comment yet</div>
                    </div>
                  ) : (
                    <>
                      {commentList.map((eachComment, index) => (
                        <Comment
                          eachComment={eachComment}
                          key={index}
                          postOwnerEmail={postOwnerEmail}
                          openOtherProfileFromPostNameClick={
                            openOtherProfileFromPostNameClick
                          }
                          setOpenCommentPage={setOpenCommentPage}
                          setOpenWhoLikeMyPost={setOpenWhoLikeMyPost}
                          myEmail={myEmail}
                          _id={_id}
                          removeLocalCurrentComment={removeLocalCurrentComment}
                          commentIndex={index}
                          postIndex={postIndex}
                          removeLocalCurrentCommentInPostCard={
                            removeLocalCurrentCommentInPostCard
                          }
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className="commentInputTagContainer">
                <textarea
                  ref={commentInputRef}
                  type="text"
                  name="caption"
                  className="commentInputTag"
                  placeholder="Write a comment..."
                  rows="2"
                  onChange={handleAddCurrComment}
                ></textarea>
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="commentSendButton"
                  onClick={() => {
                    delayCommentUploadButton
                      ? waitDelay()
                      : handleUploadComment();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;
