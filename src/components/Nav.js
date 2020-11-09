import React from "react";
import { Link } from "react-router-dom";

function Nav(props) {
	let navItems = [
		<Link to="/posts/" key={1}>
			<h1>Game Diary</h1>
		</Link>,
	];

	return (
		<nav>
			<Link to="/posts/">
				<h1>Game Diary</h1>
			</Link>

			{props.isLoggedIn ? (
				<>
					<Link to="/posts/new">
						<button>New Post</button>
					</Link>
					<div>
						<div>{`Hello, ${props.state.loggedInUser}`}</div>
						<Link to="/" onClick={props.handleLogOut}>
							Logout
						</Link>
						<img src={props.state.avatar} className="avatar"  alt=""/>
					</div>
				</>
			) : (
				<div><Link to="/users/login">Login</Link> or <Link to="/users/signup">Sign Up</Link></div>
			)}
		</nav>
	);
}

export default Nav;
