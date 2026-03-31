'use client'
import { useState } from 'react'
import '../../Styles/navbarStyle.css'
export default function Navbar() {

    const [displaySidebar, setDisplaySidebar] = useState(false)

    return (
        <>
            <div className="navbar-container">

                <div className='heading'>my<span>resume</span>buddy</div>

                {/* more features--------------------- */}
                <div className='options-box'>
                    <div className='box'>
                        {1===1 ?"RESUMES ▼":"RESUMES ▲"}
                    </div>

                    <div className='box'>
                         {1===1 ?"COVER LETTERS ▼":" COVER LETTERS ▲"}
                       
                    </div>

                    <div className='box'>
                         {1===1 ? "CVs ▼":"CVs ▲"}
                       
                    </div>

                    <div className='box'>
                         {1===1 ?"RESOURCES ▼":"RESOURCES ▲"}
                       
                    </div>
                </div>
                {/* -------------------------------- */}

                <div className='login-signup-box'>
                    <button className='login-btn'>login</button>
                    <button className='signup-btn'>Free Account</button>
                </div>

                {/* hamburger-icon */}
                <div className='hamburger-icon' onClick={() => setDisplaySidebar(prev => !prev)}>{displaySidebar ? "❌" : "☰"}</div>
                {/* -------------- */}

            </div>
            
            {/* sidebar----------------------------- */}
            {
                displaySidebar && (
                    <div className='sidebar-container'>

                        
                            <div onClick={() =>console.log("hello dabba")} className='box_'>
                                <p>RESUMES</p>
                               <p>{"❯"}</p>
                            </div>

                            <div className='box_'>
                                <p>COVER LETTERS</p>
                                 <p>{"❯"}</p>
                            </div>

                            <div className='box_'>
                                   <p>CVs</p>
                                 <p>{"❯"}</p>
                            </div>

                            <div className='box_'>
                                <p>RESOURCES</p>
                                 <p>{"❯"}</p>
                            </div>
                      
                       
                            <button className='login-btn'>login</button>
                        <button className='signup-btn'>Free Account</button>
                  
                        

                    </div>
                )
            }
            {/* ===================================== */}


        </>
    )
}