import { Navigate, Route, Routes } from "react-router-dom";
import LogIn from "./component/logIn/LogIn";
import SignUp from "./component/signUp/SignUp";
import Main from "./page/main/Main";
import { useEffect, useState } from "react";
import axios from "axios";
import "./app.scss";
import { useSelector, useDispatch } from "react-redux";
import { addUserData } from "./redux/dataSlice";

function App() {
  const userData = useSelector((state) => state.data.userData);
  const dispatch = useDispatch();

  const token = localStorage.getItem("authToken");
  const [tokenTrue, setTokenTrue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myEmail, setMyEmail] = useState();

  //check token and return user data
  useEffect(() => {
    if (token) {
      async function tokenPresent() {
        try {
          const url = "https://yankee-server.herokuapp.com/api/checktoken";
          const { data: res } = await axios.post(url, { token: token });
          await setTokenTrue(true);
          setMyEmail(res.userData.email);
          //console.log(res.userData.email);
          let recieveData = res.userData;
          setLoading(false);
          const arrayBufferToBase64 = async (buffer) => {
            let binary = "";
            let bytes = [].slice.call(new Uint8Array(buffer));
            await bytes.forEach(
              (each) => (binary += String.fromCharCode(each))
            );
            return window.btoa(binary);
          };
          //profileImage
          let base64ProfileImageObject = {};
          if (recieveData.profileImage) {
            //console.log(recieveData.profileImage.data.data);
            let base64ProfileImageString = await arrayBufferToBase64(
              recieveData.profileImage.data.data
            );
            base64ProfileImageObject = {
              ...recieveData.profileImage,
              data: base64ProfileImageString,
            };
          }
          //coverPhoto
          let base64CoverPhotoObject = {};
          if (recieveData.coverPhoto) {
            //console.log(recieveData.coverPhoto);
            let base64CoverPhotoString = await arrayBufferToBase64(
              recieveData.coverPhoto.data.data
            );
            base64CoverPhotoObject = {
              ...recieveData.coverPhoto,
              data: base64CoverPhotoString,
            };
          }
          dispatch(
            addUserData({
              ...recieveData,
              profileImage: base64ProfileImageObject,
              coverPhoto: base64CoverPhotoObject,
            })
          );
          /*
          console.log({
            ...recieveData,
            profileImage: base64ProfileImageObject,
          });
          */
          //         window.location = "/";
        } catch (error) {
          if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
          ) {
            setTokenTrue(false);
            setLoading(false);
          }
        }
      }
      tokenPresent();
    } else {
      setLoading(false);
    }
  }, [token]);
  // <Route path="/" element={<Navigate replace to="/login"/>}/>

  //get user data only

  const [changeSomething, setChangeSomething] = useState(false);
  useEffect(() => {
    if (changeSomething) {
      async function getData() {
        try {
          const url = "https://yankee-server.herokuapp.com/api/getuserdata";
          const { data: res } = await axios.post(url, { email: myEmail });
          setMyEmail(res.userData.email);
          let recieveData = res.userData;
          const arrayBufferToBase64 = async (buffer) => {
            let binary = "";
            let bytes = [].slice.call(new Uint8Array(buffer));
            await bytes.forEach(
              (each) => (binary += String.fromCharCode(each))
            );
            return window.btoa(binary);
          };
          //profileImage
          let base64ProfileImageObject = {};
          if (recieveData.profileImage) {
            let base64ProfileImageString = await arrayBufferToBase64(
              recieveData.profileImage.data.data
            );
            base64ProfileImageObject = {
              ...recieveData.profileImage,
              data: base64ProfileImageString,
            };
          }
          //coverPhoto
          let base64CoverPhotoObject = {};
          if (recieveData.coverPhoto) {
            let base64CoverPhotoString = await arrayBufferToBase64(
              recieveData.coverPhoto.data.data
            );
            base64CoverPhotoObject = {
              ...recieveData.coverPhoto,
              data: base64CoverPhotoString,
            };
          }
          dispatch(
            addUserData({
              ...recieveData,
              profileImage: base64ProfileImageObject,
              coverPhoto: base64CoverPhotoObject,
            })
          );
          /*
          console.log({
            ...recieveData,
            profileImage: base64ProfileImageObject,
          });
          */
          //         window.location = "/";
        } catch (error) {
          console.log(error);
        }
      }
      getData();
    }
    setChangeSomething(false);
  }, [changeSomething]);

  return (
    <>
      {loading ? (
        <div className="loadingContainer">
          <h1 className="loadingText">Loading...</h1>
        </div>
      ) : (
        <Routes>
          {/* tokenTrue && <Route path="/" element={<Main />}/> */}
          {tokenTrue ? (
            <Route
              path="/"
              element={
                <Main
                  userData={userData}
                  setChangeSomething={setChangeSomething}
                  changeSomething={changeSomething}
                />
              }
            />
          ) : (
            <Route path="/" element={<Navigate replace to="/logIn" />} />
          )}
          <Route path="/signup" element={<SignUp />} />
          {<Route path="/login" element={<LogIn />} />}
          {/*<Route path="/" element={<Navigate replace to="/login"/>}/>*/}
        </Routes>
      )}
    </>
  );
}

export default App;
