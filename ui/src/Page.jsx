import React from 'react'

import Contents from './Contents.jsx'
import { NavLink } from 'react-router-dom'

function Navbar() {
    return(
        <nav>
            <NavLink exact to="/">Home</NavLink>
            {' | '}
            <NavLink to="/issues">Issue List</NavLink>
            {' | '}
            <NavLink to="/report">Report</NavLink>
        </nav>
    )
}

export default function Page() {
    return(
        <div>
            <Navbar></Navbar>
            <Contents></Contents>
        </div>
    )
}