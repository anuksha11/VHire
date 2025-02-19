import React, {useState, useCallback} from "react";
import { useNavigate } from "react-router-dom";

const HomePages = () => {

    const [value, setValue]=useState("");
    const navigate=useNavigate();

    const hadleJoinRoom=useCallback(()=>{
        navigate(`/room/${value}`);
    },[navigate, value]);

  return (
    <div>
      <input 
      value={value}
      type="text" 
      placeholder="Enter your room code" 
      onChange={(e)=>setValue(e.target.value)}
      />
        <button onClick={hadleJoinRoom}>Join Meeting</button>
    </div>
  );
};

export default HomePages;