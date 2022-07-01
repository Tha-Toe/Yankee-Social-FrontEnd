import React, { useEffect, useRef, useState } from "react";
import "./nav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faCommentDots,
  faHouse,
  faMagnifyingGlass,
  faMessage,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import SearchBarPage from "./SearchBarPage";

function Nav({ openSearchBar }) {
  return (
    <div className="navContainer">
      <div className="navTop">
        <div className="logoText">Yankee</div>
        <div className="button">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="searchAndMsgIcon searchIcon"
            onClick={openSearchBar}
          />
          <FontAwesomeIcon
            icon={faCommentDots}
            className="searchAndMsgIcon msgIcon"
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;
