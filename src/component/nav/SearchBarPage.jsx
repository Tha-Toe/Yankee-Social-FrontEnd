import React, { useState, useEffect } from "react";
import "./searchBarPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowLeftLong,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import OtherProfile from "./OtherProfile";
import { useSelector } from "react-redux";

const SearchBarPage = ({
  closeSearchBar,
  openOwnerProfile,
  changeSomething,
  setChangeSomething,
  otherProfileOpen,
  setOtherProfileOpen,
  otherUserData,
  setOtherUserData,
  openOtherProfileFromPostNameClick,
  openOtherProfileFromFollowerAndFollowingClick,
  setReloadPostRequest,
  reloadPostRequest,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [foundData, setFoundData] = useState(true);
  const [searched, setSearched] = useState(false);
  //const [profileOpen, setProfileOpen] = useState(false);
  //const [otherUserData, setOtherUserData] = useState();

  //owner Email
  const ownerData = useSelector((state) => state.data.userData);
  const [ownerEmail, setOwnerEmail] = useState("");
  useEffect(() => {
    setOwnerEmail(ownerData.email);
  }, [ownerData]);

  //base64string
  const [otherUserDataBase64, setOtherUserDataBase64] = useState([]);
  const arrayBufferToBase64 = async (buffer) => {
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    await bytes.forEach((each) => (binary += String.fromCharCode(each)));
    return window.btoa(binary);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    if (!searchValue) return;
    try {
      const url = "http://localhost:3001/api/search";
      const { data: res } = await axios.post(url, { searchValue: searchValue });
      const result = await res.searchResult;
      setSearched(true);
      if (result.length === 0) {
        setFoundData(false);
        setSearchLoading(false);
      } else {
        setFoundData(true);
        let result = res.searchResult;
        await result.forEach(async (each) => {
          if (each.profileImage) {
            each["profileImage"]["data"] = await arrayBufferToBase64(
              each.profileImage.data.data
            );
          } else {
            return;
          }
        });
        setSearchResult(result);
        setSearchLoading(false);
      }
    } catch (error) {
      if (error) console.log(error);
    }
  };
  //condition
  const handleOpenOtherProfile = async (e) => {
    //console.log(e.email);
    //console.log(ownerEmail);
    if (ownerEmail === e.email) {
      openOwnerProfile();
    } else {
      try {
        const url = "http://localhost:3001/api/getuserdata";
        const { data: res } = await axios.post(url, { email: e.email });
        const otherUserDataForOtherProfileOpen = await res.userData;
        setOtherUserData(otherUserDataForOtherProfileOpen);
        setOtherProfileOpen(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //searchLoading
  const [searchLoading, setSearchLoading] = useState(false);
  return (
    <div className="searchBarPageContainer">
      <div className="searchBarPageChild">
        <div
          className={`${"searchBarContainer"} ${
            otherProfileOpen ? "sbcGray" : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faArrowLeftLong}
            className="backIcon"
            onClick={() => {
              closeSearchBar();
              setOtherProfileOpen(false);
            }}
          />
          <div className="searchContainer">
            <FontAwesomeIcon className="sbpIcon" icon={faMagnifyingGlass} />
            <form className="searchForm" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search"
                className="sbpSearchBar"
                onChange={(e) => {
                  setSearchValue(e.target.value.toLowerCase());
                  setSearched(false);
                  setFoundData(true);
                  setOtherProfileOpen(false);
                }}
              />
            </form>
          </div>
        </div>
        <div className="searchBarPageBodyContainer">
          {otherProfileOpen ? (
            <OtherProfile
              otherUserData={otherUserData}
              setChangeSomething={setChangeSomething}
              changeSomething={changeSomething}
              openOtherProfileFromPostNameClick={
                openOtherProfileFromPostNameClick
              }
              openOtherProfileFromFollowerAndFollowingClick={
                openOtherProfileFromFollowerAndFollowingClick
              }
              setReloadPostRequest={setReloadPostRequest}
              reloadPostRequest={reloadPostRequest}
            />
          ) : (
            <>
              {foundData ? (
                <>
                  {searchValue && searched ? (
                    <div className="resultContainer">
                      {searchResult.map((e, index) => (
                        <div
                          key={index}
                          className="resultChild"
                          onClick={() => handleOpenOtherProfile(e)}
                        >
                          <div className="nameAndPhotoResult">
                            {e.profileImage ? (
                              <img
                                className="profileImg"
                                src={`data:${e.profileImage.contentType};base64, ${e.profileImage.data}`}
                              />
                            ) : (
                              <img
                                className="profileImg"
                                src="/defaultProfileImage.png"
                              />
                            )}

                            <div className="nameTag">
                              {e.firstName + " " + e.lastName}
                            </div>
                          </div>
                          <div className="mbc">
                            <FontAwesomeIcon icon={faMessage} />
                          </div>
                        </div>
                      ))}
                      <div className="noMoreResult">
                        <FontAwesomeIcon
                          icon={faMagnifyingGlass}
                          className="noMoreIcon"
                        />
                        <div className="noMoreText">That's all result</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {searchLoading && (
                        <div className="searchLoading">Loading...</div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="notResultFoundContainer">
                  <div className="notResultFoundChild">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="notFoundLensIcon"
                    />
                    <div className="notFoundText">
                      User with name key ({searchValue}) is not found.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBarPage;
