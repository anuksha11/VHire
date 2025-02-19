import React from "react";
import { useParams } from "react-router-dom";
import {ZegoUIKitPrebuilt} from "@zegocloud/zego-uikit-prebuilt";

const RoomPage = () => {   
    let {roomId} = useParams();

    console.log(roomId);

    const myMeeting = async (element)=>{
        const appId= 1977899363
        const serversecret="6dccad0d65972e07cd7f4d48597e9bde"
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serversecret, roomId, Date.now().toString(), "Mihir Patel");
        const zc = ZegoUIKitPrebuilt.create(kitToken)
        zc.joinRoom({
            container: element,
            sharedLinks:[
                { name: "Room Link" }
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
            success: ()=>{
                console.log("Meeting Started")
            },
        })
    }
    return (
        <div>
            <div ref={myMeeting}></div>
        </div>
    );
}

export default RoomPage;