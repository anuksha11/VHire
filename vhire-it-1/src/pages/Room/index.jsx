import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// Generate a random user ID
function randomID(len = 5) {
  const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const RoomPage = () => {
  const { roomId } = useParams();
  const userID = randomID();
  const [usersInMeeting, setUsersInMeeting] = useState([]);

  useEffect(() => {
    document.title = `Meeting Room - ${roomId}`;
  }, [roomId]);

  const myMeeting = async (element) => {
    const appId = 1977899363;
    const serverSecret = "6dccad0d65972e07cd7f4d48597e9bde";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      userID,
      "Guest"
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Invite Link",
          url: `${window.location.origin}/room/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      showScreenSharingButton: true,
      success: () => console.log("Meeting Started"),
      onUserAttend: (user) => {
        setUsersInMeeting((prevUsers) => {
          if (!prevUsers.some((u) => u.userID === user.userID)) {
            return [...prevUsers, user];
          }
          return prevUsers;
        });
      },
      onUserLeave: (user) => {
        setUsersInMeeting((prevUsers) => prevUsers.filter((u) => u.userID !== user.userID));
      },
    });
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Full-Screen Meeting Container */}
      <div ref={myMeeting} className="flex-1 w-full h-full"></div>

      {/* Bottom Section for Participants */}
      <div className="w-full bg-gray-800 text-white p-3 text-center">
        <h3 className="text-lg font-semibold">Participants:</h3>
        <ul className="flex flex-wrap justify-center gap-4 mt-2">
          {usersInMeeting.map((user) => (
            <li key={user.userID} className="bg-gray-700 px-4 py-2 rounded-lg">
              {user.userName || "Guest"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomPage;
