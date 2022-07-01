import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./comment.scss";
const Comment = ({
  eachComment,
  postOwnerEmail,
  openOtherProfileFromPostNameClick,
  setOpenCommentPage,
  myEmail,
  _id,
  postIndex,
  removeLocalCurrentComment,
  commentIndex,
  removeLocalCurrentCommentInPostCard,
}) => {
  const [commentText, setCommentText] = useState("");
  const [commentOwnerName, setCommentOwnerName] = useState("");
  const [timeAgo, setTimeAgo] = useState("");
  const [commentOwnerProfileImage, setCommentOwnerProfileImage] = useState({});
  const [authorMent, setAuthorMent] = useState(false);
  const [userData, setUserData] = useState();
  const [commentDataForDelete, setCommentDataForDelete] = useState({});

  const arrayBufferToBase64String = async (buffer) => {
    let binary = "";
    let bytes = await [].slice.call(new Uint8Array(buffer));
    await bytes.forEach((each) => (binary += String.fromCharCode(each)));
    return window.btoa(binary);
  };

  useEffect(() => {
    const getUserDataFunction = async () => {
      if (eachComment.commentOwner === postOwnerEmail) {
        setAuthorMent(true);
      } else {
        setAuthorMent(false);
      }
      if (eachComment.commentText) {
        setCommentText(eachComment.commentText);
      }
      if (eachComment.commentOwner) {
        try {
          const url = "http://localhost:3001/api/getuserdata";
          const { data: res } = await axios.post(url, {
            email: eachComment.commentOwner,
          });
          let userData = await res.userData;
          setUserData(res.userData);
          //name
          if (userData.firstName) {
            let userNameRaw = userData.firstName + " " + userData.lastName;
            setCommentOwnerName(userNameRaw);
          }

          //profileImage

          if (userData.profileImage) {
            if (userData.profileImage.data.data) {
              async function postDataPostImageDataData() {
                let base64PostImageObject = {};
                let base64PostImageString = await arrayBufferToBase64String(
                  userData.profileImage.data.data
                );
                base64PostImageObject = {
                  contentType: userData.profileImage.contentType,
                  data: base64PostImageString,
                };
                setCommentOwnerProfileImage(base64PostImageObject);
              }
              postDataPostImageDataData();
            } else if (userData.profileImage.data) {
              async function postDataPostImageData() {
                let base64PostImageObject = {};
                let base64PostImageStringData = await arrayBufferToBase64String(
                  userData.profileImage.data
                );
                base64PostImageObject = {
                  contentType: userData.profileImage.contentType,
                  data: userData.profileImage.data,
                };
                setCommentOwnerProfileImage(base64PostImageObject);
              }
              postDataPostImageData();
            } else {
              setCommentOwnerProfileImage({});
            }
          } else {
            setCommentOwnerProfileImage({});
          }
        } catch (error) {
          console.log(error);
        }
      }
      //time
      if (eachComment.commentUploadTime) {
        const uploadSeconds = eachComment.commentUploadTime.uploadSeconds;
        const uploadDate = eachComment.commentUploadTime.uploadDate;
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
      }
      //commentDataForDelete
      setCommentDataForDelete(eachComment);
    };
    getUserDataFunction();
  }, [eachComment]);
  //postId
  const [_idPost, set_idPost] = useState("");
  useEffect(() => {
    set_idPost(_id);
  }, [_id]);

  //validate delete post
  const [thisIsMyComment, setThisIsMyComment] = useState(false);
  useEffect(() => {
    if (myEmail === eachComment.commentOwner) {
      setThisIsMyComment(true);
    } else if (myEmail === postOwnerEmail) {
      setThisIsMyComment(true);
    } else {
      setThisIsMyComment(false);
    }
  }, [myEmail, eachComment, postOwnerEmail]);

  const [openDeletecomment, setOpenDeleteComment] = useState(false);

  //delete comment
  const [delayDeleteButton, setDeleyDeleteButton] = useState(false);
  const deleteCommentFunction = async () => {
    try {
      setDeleyDeleteButton(true);

      console.log("function start");
      const url = "http://localhost:3001/api/deletecomment";
      const { data: res } = await axios.post(url, {
        commentDataForDelete: commentDataForDelete,
        _id: _idPost,
      });

      await removeLocalCurrentCommentInPostCard(commentIndex);
      await removeLocalCurrentComment({
        postIndex: postIndex,
        commentIndex: commentIndex,
      });
      setDeleyDeleteButton(false);
      setOpenDeleteComment(false);
    } catch (error) {
      console.log(error);
    }
  };
  const noFunction = () => {
    return;
  };
  return (
    <>
      {userData ? (
        <>
          <div className="eachCommentContainer">
            {commentOwnerProfileImage.data ? (
              <img
                src={`data:${commentOwnerProfileImage.contentType};base64, ${commentOwnerProfileImage.data}`}
                className="eachCommentOwnerImage"
                onClick={() => {
                  openOtherProfileFromPostNameClick(userData);
                  setOpenCommentPage(false);
                }}
              />
            ) : (
              <img
                src="/defaultProfileImage.png"
                className="eachCommentOwnerImage"
              />
            )}
            <div className="eachCommentTextAndDateContainer">
              <div className="eachCommentTextAndDateChild">
                <div className="eachCommentTextContainer">
                  <div
                    className="commentOwnerName"
                    onClick={() => {
                      openOtherProfileFromPostNameClick(userData);
                      setOpenCommentPage(false);
                    }}
                  >
                    {commentOwnerName}
                    {authorMent && <div className="authorMark">Author</div>}
                  </div>
                  <div className="commentTextTag">
                    <div className="commentText">{commentText}</div>
                  </div>
                </div>
                <div className="hoursAgoAndDeleteContainer">
                  <div className="commentDate">{timeAgo}</div>
                  {thisIsMyComment && (
                    <div className="deleteCommentContainer">
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="deleteButton"
                        onClick={() => {
                          setOpenDeleteComment(true);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {openDeletecomment && (
            <div className="deleteAskCommentContainer">
              <div className="deleteCommentChild">
                <div className="wantToDelete">
                  Do you want to delete this comment?
                </div>
                <div className="deleteButtonContainer">
                  <button
                    className="cancelDeleteButton"
                    onClick={() => {
                      setOpenDeleteComment(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="deleteSureButton"
                    onClick={() => {
                      delayDeleteButton
                        ? noFunction()
                        : deleteCommentFunction();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="loadingCommentContainer">
          <div className="loadingCommentChild">
            <div className="loadingImage"></div>
            <div className="loadingCommentTextContainer"></div>
          </div>
        </div>
      )}
    </>
  );
};
export default Comment;
