import React, { useState } from 'react';
import {
  ExternalLinkIcon,
  LogOutIcon,
  PlusIcon,
  SunIcon,
  UserIcon,
} from "../assets/icons";

const options = [
  { icon: <UserIcon />, text: "Upgrade to Plus", link: "https://chat.openai.com/auth/login" },
  { icon: <SunIcon />, text: "Light mode" },
  { icon: <ExternalLinkIcon />, text: "Get help", link: "https://help.openai.com/en/collections/3742473-chatgpt" },
  { icon: <LogOutIcon />, text: "Log out" },
];

function LeftSection() {
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleLightMode = () => {
    setIsLightMode(!isLightMode);
    // You can also save the user's preference in local storage here
  };

  const handleOptionClick = (link) => {
    // Redirect to the specified link when an option is clicked
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div className={`flex flex-col ${isLightMode ? 'bg-white' : 'bg-black'} fixed top-0 bottom-0 w-[260px]`}>
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex h-full w-full flex-1 items-start border-white/20">
          <nav className={`flex h-full flex-1 flex-col space-y-1 p-2 ${isLightMode ? 'text-black' : 'text-white'}`}>
            <a className="flex px-3 py-3 items-center gap-3 rounded-md cursor-pointer border border-white/20 text-sm mb-2 flex-shrink-0 hover:bg-gray-500/10">
              <PlusIcon />
              New Chat
            </a>
            <div className="flex-col flex-1 overflow-y-auto border-b border-white/20"></div>
            {options.map((item) => (
              <a
                className={`flex gap-3 px-3 py-3 items-center rounded-md hover:bg-gray-500/10 cursor-pointer ${item.text === "Light mode" ? 'light-mode-option' : ''}`}
                key={item.text}
                onClick={() => item.text === "Light mode" ? toggleLightMode() : handleOptionClick(item.link)}
              >
                {item.icon}
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
