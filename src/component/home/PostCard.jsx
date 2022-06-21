import React from "react";
import "./postCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faThumbsUp,
  faMessage,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

function PostCard({ tempoState }) {
  return (
    <div className="postCardContainer">
      <div className="postCardChild">
        <div className="postHeader">
          <div className="nameContainer">
            <div className="postProfileImageContainer">
              <img src="/defaultProfileImage.png" className="pfImage" />
            </div>
            <div className="postProfileName">
              <div className="postName">Tha Toe Saung</div>
              <div className="postHour">1 hr ago</div>
            </div>
          </div>
          <div className="postEditContainer">
            <FontAwesomeIcon icon={faEllipsis} className="postEditIcon" />
          </div>
        </div>
        <div className="postDetail">
          <div className="postCaption">{tempoState.caption}</div>
        </div>
        {tempoState.img && (
          <div className="postImageContainer">
            <img src={tempoState.img} className="postImage" />
          </div>
        )}
        <div className="postBottom">
          <div className="amountContainer">
            <div className="reactionContainer">
              {tempoState.like && (
                <>
                  <FontAwesomeIcon icon={faThumbsUp} className="reactionIcon" />
                  <div className="reactionAmount">{tempoState.like}</div>
                </>
              )}
            </div>
            <div className="commentAndShareContainer">
              {tempoState.comment && (
                <div className="commentAmount">
                  {tempoState.comment} comments
                </div>
              )}
              {tempoState.share && (
                <div className="shareAmount">{tempoState.share} shares</div>
              )}
            </div>
          </div>
          <div className="likeShareCommentContainer">
            <div className="likeShareCommentChild">
              <div className="lcsContainer">
                <FontAwesomeIcon icon={faThumbsUp} className="lcsIcon" />
                <div className="lcsText">Like</div>
              </div>
              <div className="lcsContainer">
                <FontAwesomeIcon icon={faMessage} className="lcsIcon" />
                <div className="lcsText">Comment</div>
              </div>
              <div className="lcsContainer">
                <FontAwesomeIcon icon={faShare} className="lcsIcon" />
                <div className="lcsText">Share</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
