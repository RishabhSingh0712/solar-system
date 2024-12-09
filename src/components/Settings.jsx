import React,{useState} from "react";
import MobNavBar from "./MobileNavBar";
const Settings =()=>{
    
    return(
        <div className="max-w-full bg-gray-100">
               {/* Use MobileNavbar component */}
      <MobNavBar/>

      <h1 className="justify-center text-3xl font-bold items-center">Settings</h1>
        </div>
    );
}
export default Settings;