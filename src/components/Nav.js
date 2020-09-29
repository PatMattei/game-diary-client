import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function Nav(props) {
	return(
		<nav>
			<h1>
				<Link to="/posts/">Game Diary</Link>
			</h1>
			<Link to="/posts/new">New Post</Link>
			<Link to="/users/login">Login</Link>
			<Link to="/users/signup">Sign Up</Link>
		</nav>
	)
}

export default Nav;