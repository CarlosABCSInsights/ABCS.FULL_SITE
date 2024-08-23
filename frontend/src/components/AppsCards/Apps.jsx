import React from "react";
import {BiTimeFive} from 'react-icons/bi';
import logo1 from '../../assets/react.svg';
import { Link } from 'react-router-dom';

const Data = [
    {
        id:1, 
        image: logo1, 
        time: 'Now',
        title: 'Feasibility Calculator',
        desc: 'Lorem impsum, dolor sit amet consectetur adipisicing elit. Corrupti, laboriosam!',
        tool: 'Analytical Tool',
        url: '/feasibilityCalculator'
    },
    {
        id:2, 
        image: logo1, 
        time: 'Now',
        title: 'Street Matching Tool',
        desc: 'Lorem impsum, dolor sit amet consectetur adipisicing elit. Corrupti, laboriosam!',
        tool: 'Analytical Tool',
        url: '/feasibilityCalculator'
    },
    {
        id:3, 
        image: logo1, 
        time: 'Now',
        title: 'Product Definition [TEST]',
        desc: 'Lorem impsum, dolor sit amet consectetur adipisicing elit. Corrupti, laboriosam!',
        tool: 'Analytical Tool',
        url: '/productDefinitionApp'
    },
    {
        id:4, 
        image: logo1, 
        time: 'Now',
        title: 'Product Finder',
        desc: 'Lorem impsum, dolor sit amet consectetur adipisicing elit. Corrupti, laboriosam!',
        tool: 'Analytical Tool',
        url: '/productFinder'
    },
    {
        id:5, 
        image: logo1, 
        time: 'Now',
        title: 'Feasibility Calculator',
        desc: 'Lorem impsum, dolor sit amet consectetur adipisicing elit. Corrupti, laboriosam!',
        tool: 'Analytical Tool',
        url: '/feasibilityCalculator'
    },
    {
        id:6, 
        image: logo1, 
        time: 'Now',
        title: 'Feasibility Calculator',
        desc: 'Lorem impsum, dolor sit amet consectetur adipisicing elit. Corrupti, laboriosam!',
        tool: 'Analytical Tool',
        url: '/feasibilityCalculator'
    },
    {
        id:7, 
        image: logo1, 
        time: 'Now',
        title: 'Feasibility Calculator',
        desc: 'Lorem impsum, dolor sit amet consectetur adipisicing elit. Corrupti, laboriosam!',
        tool: 'Analytical Tool',
        url: '/feasibilityCalculator'
    }
]

// 

const Apps = () => { 
    return (
        <div>
            <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10">
            
            {
                Data.map(({id, image, time,title, desc, tool, url}) => {
                    return (
                    <div key={id} className="group group/item singleJob w-[250px] p-[20px] bg-white rounded[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg">
                        <span className="flex justify-between items-center gap-4">
                            <h1 className="text-[16px] font-semibold text-textColor group-hover:text-white">{title}</h1>
                            <span className="flex items-center text-[#ccc] gap-1">
                                <BiTimeFive />{time}
                            </span>
                        </span>
                        <h6 className="text-[#ccc]">Canada</h6>
                        <p className="text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-white">
                            {desc}
                        </p>
                        <div className="company flex items-center gap-2">
                            <img src={image} alt="Company Logo" className="w-[10%]"/>
                            <span className="text-[14px] py-[1rem] block group-hover:text-white">{tool}</span>
                        </div>
                        <Link to={url} >
                        <button className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-textColor hover:bg-white group-hover/item:text-black #group-hover:text-greyIsh">
                            Go
                        </button>   
                        </Link>
                    </div>
                    )
                })
            }
            </div>
        </div>
    )
}
export default Apps;