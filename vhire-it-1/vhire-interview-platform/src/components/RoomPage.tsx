import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const RoomPage: React.FC = () => {
    const { roomId } = useParams();
    const location = useLocation();

    // Function to parse query parameters
    const getQueryParams = (search: any) => {
        return new URLSearchParams(search);
    };

    // Get the name from the query parameters
    const queryParams = getQueryParams(location.search);
    const name = queryParams.get('name');

    console.log(name);
    const navigate = useNavigate();
    const zpRef = useRef<ZegoUIKitPrebuilt | null>(null);
    const videoContainerRef = useRef<HTMLDivElement | null>(null);
    const [callType, setCallType] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const type = query.get("type");
        setCallType(type || "");
    }, [location.search]);

    useEffect(() => {
        if (!callType || !roomId) return;
        
        const appID = 1803852747;
        const serverSecret = "a039bd3defe5b6b9aa0d23d3fcd43438";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), name?.toString() || "");
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;
        
        zp.joinRoom({
            container: videoContainerRef.current,
            scenario: { mode: callType === "one-on-one" ? ZegoUIKitPrebuilt.OneONoneCall : ZegoUIKitPrebuilt.GroupCall },
            maxUsers: callType === "one-on-one" ? 2 : 10,
            onLeaveRoom: () => navigate("/"),
        });
        
        return () => zp.destroy();
    }, [callType, roomId, navigate]);

    const handleCopyRoomId = async () => {
        const meetingLink = `${roomId}`;
        try {
            await navigator.clipboard.writeText(meetingLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy room ID:', err);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col bg-gray-50">
            <div className="w-full bg-white shadow-md p-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Room ID:
                        </h1>
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
                            <code className="text-sm text-gray-700">
                                {`${roomId}`}
                            </code>
                            <button 
                                onClick={handleCopyRoomId}
                                className="text-blue-500 hover:text-blue-700 transition-colors"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate("/")} 
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                        Exit
                    </button>
                </div>
            </div>
            <div ref={videoContainerRef} className="flex-1 w-full h-full" />
        </div>
    );
};

export default RoomPage;
