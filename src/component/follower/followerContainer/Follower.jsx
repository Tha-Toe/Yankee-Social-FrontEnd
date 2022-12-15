import React, { useEffect, useState } from "react";
import FollowCard from "../followCard/FollowCard";
import FollowingCard from "../followingCard/FollowingCard";
import SuggestCard from "../suggestCard/SuggestCard";
import "./follower.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import { ApiUrls } from "../../../api/ApiUrls";

function Follower({
  setChangeSomething,
  openOtherProfileFromFollowerAndFollowingClick,
  setOtherProfileOpen,
  followerOpenInFollower,
  setFollowerOpenInFollower,
  followingOpen,
  setFollowingOpen,
  suggestOpen,
  setSuggestOpen,
}) {
  let myEmail = useSelector((state) => state.data.userData.email);
  const [tempoState] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  //following unfollowFunction
  const [followingEmailList, setfollowingEmailList] = useState([]);
  let followingEmailListRaw = useSelector(
    (state) => state.data.userData.following.followingPeople
  );
  const [refreshMap, setRefreshMap] = useState(true);
  useEffect(() => {
    setfollowingEmailList(followingEmailListRaw);
  }, [followingEmailListRaw]);
  const unfollowFunction = async (e) => {
    let otherEmail = e;
    const url = ApiUrls.apiUrl + ApiUrls.followUrl;
    const { data: res } = await axios.post(url, {
      otherEmail: otherEmail,
      myEmail: myEmail,
    });
    setChangeSomething(true);
    console.log("success");
  };
  const temporaryPopEmail = async (e) => {
    let popEmail = e;
    setRefreshMap(false);
    let followingEmailListPop = await followingEmailList.filter((eachEmail) => {
      return eachEmail !== popEmail;
    });
    setfollowingEmailList(followingEmailListPop);
    setRefreshMap(true);
    console.log(followingEmailListPop);
  };

  //follower followFunction
  const [alreadyFollowFollowerEmailList, setAlreadyFollowFollowerEmailList] =
    useState([]);
  const [followerEmailList, setFollowerEmailList] = useState([]);
  let followerEmailListRaw = useSelector(
    (state) => state.data.userData.follower.followerPeople
  );
  useEffect(() => {
    setFollowerEmailList([]);
    setAlreadyFollowFollowerEmailList([]);
    /*
    followerEmailListRaw.map((eachFollower) => {
      if (followingEmailListRaw.indexOf(eachFollower) === -1) {
        setFollowerEmailList([...followerEmailList, eachFollower]);
      } else {
        setAlreadyFollowFollowerEmailList([
          ...alreadyFollowFollowerEmailList,
          eachFollower,
        ]);
      }
    });
    */
    const alreadyFilterFunction = async () => {
      let finalFollowerEmailList = await followerEmailListRaw.filter((each) => {
        return followingEmailListRaw.indexOf(each) === -1;
      });
      setFollowerEmailList(finalFollowerEmailList);
      let finalAlreadyFollowEmailList = await followerEmailListRaw.filter(
        (each) => {
          return followingEmailListRaw.indexOf(each) >= 0;
        }
      );
      setAlreadyFollowFollowerEmailList(finalAlreadyFollowEmailList);
    };
    alreadyFilterFunction();

    //setAlreadyFollowFollowerEmailList(followerEmailListRaw);
  }, [followerEmailListRaw, followingEmailListRaw]);
  const [alreadyFollowHideFollowButton, setAlreadyFollowHideFollowButton] =
    useState(true);

  //suggestionEmailList
  let myData = useSelector((state) => state.data.userData);
  const [suggestEmailList, setSuggestEmailList] = useState([]);
  useEffect(() => {
    async function getSuggestEmailList() {
      try {
        setSuggestEmailList([]);
        //console.log("it's start");
        const url = ApiUrls.apiUrl + ApiUrls.searchUrl;
        const { data: res } = await axios.post(url, {
          getRandomSuggestEmail: "getRandomSuggestEmail",
        });
        //console.log(res.randomSuggestEmail);
        let randomSuggestData = await res.randomSuggestEmail;
        //filter
        const suggestEmailArray = await randomSuggestData.filter((each) => {
          return (
            followingEmailListRaw.indexOf(each.email) < 0 &&
            each.email !== myEmail
          );
        });
        let finalSuggestEmailArray = suggestEmailArray.slice(0, 20);
        setSuggestEmailList(finalSuggestEmailArray);
      } catch (error) {
        console.log(error);
      }
    }
    getSuggestEmailList();
  }, []);
  const temporaryPopSuggestEmail = async (e) => {
    let popEmail = e;
    setRefreshMap(false);
    let suggestEmailListPop = await suggestEmailList.filter((eachEmail) => {
      return eachEmail.email !== popEmail;
    });
    setSuggestEmailList(suggestEmailListPop);
    setRefreshMap(true);
  };

  const navChange = (e) => {
    if (e === "follower") {
      setFollowerOpenInFollower(true);
      setFollowingOpen(false);
      setSuggestOpen(false);
    } else if (e === "following") {
      setFollowerOpenInFollower(false);
      setFollowingOpen(true);
      setSuggestOpen(false);
    } else {
      setFollowerOpenInFollower(false);
      setFollowingOpen(false);
      setSuggestOpen(true);
    }
  };
  return (
    <div className="ffsContainer">
      <div className="ffsChild">
        <div className="pwfu">
          <div className="followerNavBar">
            <div
              className={`${
                followerOpenInFollower ? "followerActive" : "followerUnActive"
              } ${"followerNavChild"}`}
              onClick={() => navChange("follower")}
            >
              Follower
            </div>
            <div
              className={`${
                followingOpen ? "followerActive" : "followerUnActive"
              } ${"followerNavChild"}`}
              onClick={() => navChange("following")}
            >
              Following
            </div>
            <div
              className={`${
                suggestOpen ? "followerActive" : "followerUnActive"
              } ${"followerNavChild"}`}
              onClick={() => navChange("suggest")}
            >
              Suggestion
            </div>
          </div>
          <div className="followCard">
            {followerOpenInFollower && (
              <>
                {followerEmailListRaw.length === 0 ? (
                  <>
                    <div className="noFollowerText">
                      You don't have follower.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="titleAndAmountTag">
                      <div className="titleTag">Follower</div>
                      <div className="amountTag">
                        {followerEmailListRaw.length}
                      </div>
                    </div>
                    {followerEmailList.map((followerEmail, index) => (
                      <FollowCard
                        key={index}
                        followerEmail={followerEmail}
                        unfollowFunction={unfollowFunction}
                        openOtherProfileFromFollowerAndFollowingClick={
                          openOtherProfileFromFollowerAndFollowingClick
                        }
                        setOtherProfileOpen={setOtherProfileOpen}
                      />
                    ))}
                    {alreadyFollowFollowerEmailList.map(
                      (followerEmail, index) => (
                        <FollowCard
                          key={index}
                          followerEmail={followerEmail}
                          unfollowFunction={unfollowFunction}
                          alreadyFollowHideFollowButton={
                            alreadyFollowHideFollowButton
                          }
                          openOtherProfileFromFollowerAndFollowingClick={
                            openOtherProfileFromFollowerAndFollowingClick
                          }
                          setOtherProfileOpen={setOtherProfileOpen}
                        />
                      )
                    )}
                  </>
                )}
              </>
            )}
            {followingOpen && (
              <>
                {followingEmailList.length === 0 ? (
                  <>
                    <div className="noFollowerText">
                      You are not following anyone.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="titleAndAmountTag">
                      <div className="titleTag">Following</div>
                      <div className="amountTag">
                        {followingEmailList.length}
                      </div>
                    </div>
                    {followingEmailList.map((followingEmail, index) => (
                      <FollowingCard
                        key={index}
                        followingEmail={followingEmail}
                        followingEmailList={followingEmailList}
                        unfollowFunction={unfollowFunction}
                        openOtherProfileFromFollowerAndFollowingClick={
                          openOtherProfileFromFollowerAndFollowingClick
                        }
                        setOtherProfileOpen={setOtherProfileOpen}
                        temporaryPopEmail={temporaryPopEmail}
                        refreshMap={refreshMap}
                      />
                    ))}
                  </>
                )}
              </>
            )}
            {suggestOpen && (
              <>
                {suggestEmailList.length === 0 ? (
                  <>
                    <div className="noFollowerText">
                      Loading...getting suggest data.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="titleAndAmountTag">
                      <div className="titleTag">Suggest People</div>
                      <div className="amountTag">{suggestEmailList.length}</div>
                    </div>
                    {refreshMap &&
                      suggestEmailList.map((suggestEmail, index) => (
                        <SuggestCard
                          key={index}
                          suggestEmail={suggestEmail}
                          suggestEmailList={suggestEmailList}
                          unfollowFunction={unfollowFunction}
                          openOtherProfileFromFollowerAndFollowingClick={
                            openOtherProfileFromFollowerAndFollowingClick
                          }
                          setOtherProfileOpen={setOtherProfileOpen}
                          temporaryPopSuggestEmail={temporaryPopSuggestEmail}
                          refreshMap={refreshMap}
                        />
                      ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="pumn"></div>
      </div>
    </div>
  );
}
export default Follower;
