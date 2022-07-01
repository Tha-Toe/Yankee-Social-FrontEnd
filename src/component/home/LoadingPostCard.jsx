import React from "react";
import "./loadingPostCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faThumbsUp,
  faMessage,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

function LoadingPostCard({}) {
  return (
    <div className="postCardContainerl">
      <div className="postCardChildl">
        <div className="postCardChildlc">
          <div className="postHeaderl"></div>
          <div className="postDetaill"></div>
          <div className="postImageContainerl"></div>
          <div className="postBottoml">
            <div className="amountContainerl"></div>
            <div className="likeShareCommentContainerl">
              <div className="likeShareCommentChildl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingPostCard;
