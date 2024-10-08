import React from "react";
import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react'

// ICONS
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
//import { TbTruckDelivery } from "react-icons/tb";
import { AiOutlineHistory } from "react-icons/ai";
//import { FaWallet } from "react-icons/fa";
import { MdFavorite, MdHelp } from "react-icons/md";

const Navbar = () => {
    const [nav, setNav] = useState(false);
  
    const menuItems = [
      { icon: <AiOutlineHistory size={25} className="mr-4" />, text: "History" },
      { icon: <MdFavorite size={25} className="mr-4" />, text: "Favorites" },
      //{ icon: <FaWallet size={25} className="mr-4" />, text: "Wallet" },
      { icon: <MdHelp size={25} className="mr-4" />, text: "Help" },
    ];
    return (
      <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4 py-6  shadow-sm">
        {/* Left side */}
        <div className="flex items-center">
          <div onClick={() => setNav(!nav)} className="cursor-pointer">
            <AiOutlineMenu size={30} />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2 text-blueColor">
             <span className="font-bold">ABCS</span>Insights
          </h1>
          <div className="hidden lg:flex items-center bg-gray-200 rounded-full p-1 text-[14px]">
            <p className="bg-black text-white rounded-full p-2">Black</p>
            <p className="p-2">White</p>
          </div>
        </div>
  
        {/* Search Input */}
        <div className="bg-gray-200 rounded-full flex items-center px-2 w-[200px] sm:w-[400px] lg:w-[500px]">
          <AiOutlineSearch size={25} />
          <input
            className="bg-transparent p-2 w-full focus:outline-none"
            type="text"
            placeholder="Search foods"
          />
        </div>
        {/* Cart button */}
        <button className="bg-black text-white hidden md:flex items-center py-2 rounded-full border border-black px-5 ">
          {/*<BsFillCartFill size={20} className="mr-2" /> Cart */}
          <AiOutlineHistory size={20} className="mr-2" /> History
        </button>
  
        {/* Mobile Menu */}
        {/* Overlay */}
        {nav ? (
          <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>
        ) : (
          ""
        )}
  
        {/* Side drawer menu */}
        <div
          className={
            nav
              ? "fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-300"
              : "fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-300"
          }
        >
          <AiOutlineClose
            onClick={() => setNav(!nav)}
            size={30}
            className="absolute right-4 top-4 cursor-pointer"
          />
          <h2 className="text-2xl p-4">
            ABCS <span className="font-bold">Insights</span>
          </h2>
          <nav>
            <ul className="flex flex-col p-4 text-gray-800">
              {menuItems.map(({ icon, text }, index) => {
                return (
                  <div key={index} className=" py-4">
                    <li className="text-xl flex cursor-pointer  w-[50%] rounded-full mx-auto p-2 hover:text-white hover:bg-black">
                      {icon} {text}
                    </li>
                  </div>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    );
  };
  
  export default Navbar;

/** 
const Navbar = () => { 
    return (
        <div className="navBar flex justify-between items-center p-[3rem]">
            <div className="logoDiv">
            <Link to='http://localhost:5173' >
                    <h1 className="logo text-[25px] text-blueColor"><strong>ABCS</strong>Insights</h1>
            </Link>
            </div>
            <div className="menu flex gap-8">
                    <li className="menuList text-[#6f6f6f] hover:text-blueColor">Apps</li>
                    <li className="menuList text-[#6f6f6f] hover:text-blueColor">Companies</li>
                    <li className="menuList text-[#6f6f6f] hover:text-blueColor">About</li>
                    <li className="menuList text-[#6f6f6f] hover:text-blueColor">Contact</li>
                    <li className="menuList text-[#6f6f6f] hover:text-blueColor">Blog</li>
                    <li className="menuList text-[#6f6f6f] hover:text-blueColor">Login</li>
            </div>
        </div>
        
    )
}
export default Navbar;
*/