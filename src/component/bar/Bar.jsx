import React, { useState } from "react";
import "./bar.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";

function Bar (){

    const [logOutAlertOpen,setLogOutAlertOpen] = useState(false);

    const handleLogOut = () => {
        setLogOutAlertOpen(true);
    }
    const handleLogOutCancle = () => {
        setLogOutAlertOpen(false);
    }
    const logOut = () => {
        localStorage.removeItem("authToken");
        window.location.reload();
    };
    return(
        <div className="barContainer">
            <div className="barChild">
                <div className="barListContainer"> 
                    <FontAwesomeIcon icon={faGear} className="barIcon"/>
                    <div className="barText">Setting</div>
                </div>
                <div className="barListContainer" onClick={handleLogOut}> 
                    <FontAwesomeIcon icon={faRightFromBracket} className="barIcon"/>
                    <div className="barText">Log Out</div>
                </div>
            </div>
            <div className={`${logOutAlertOpen? "dBlock" : ""} ${"logOutAlertContainer"}`}>
                <div className="logOutAlertChild">
                <div className="logOutYankeeText">Yankee</div>
                    <div className="logOutAlertText">Do you want to log out?</div>
                    <div className="logOutButtonContainer">
                        <button className="logOutCancleButton" onClick={handleLogOutCancle}>Cancel</button>
                        <button className="logOutYesButton" onClick={logOut}>Yes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Bar;