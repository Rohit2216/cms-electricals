import React from 'react'
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs'
import { Link } from 'react-router-dom'

const JsFooter = () => {
    return (
        <div className='d-md-flex text-center align-items-center justify-content-between'>
            <small>© {new Date().getFullYear()} | <Link to="/" className='text-secondary'>CMS Electricals.</Link> | All rights reserved</small>
            {/* <small><Link className='nav-link text-secondary' to="/TermConditions">Term & Conditions</Link></small> */}
            <span className='d-flex gap-4 my-md-0 my-2 justify-content-center'>
                {[<BsFacebook className='facebook' />, <BsLinkedin className='linkedin' />, <BsInstagram className='instagram' />, <BsTwitter className='twitter' />].map((item, idx) => (
                    <span key={idx} className='my-btn d-align'>{item}</span>
                ))}
            </span>
        </div>
    )
}

export default JsFooter