import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import Posts from "./components/Posts.js";
import Show from "./components/Show.js";
import New from "./components/New.js";
import Nav from "./components/Nav.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
import Edit from "./components/Edit.js";
import UserPosts from "./components/UserPosts.js";

export default function App(props) {
	const history = useHistory();

	const [posts, setPosts] = useState([]);
	const [state, setState] = useState({
		username: "",
		password: "",
		email: "",
		loggedInUser: "",
	});
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const decodedToken = (token) => {
		return jwt_decode(token);
	};



	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post(
				(process.env.REACT_APP_API_URL || "http://localhost:3000") +
					"/users/login",
				{
					user: {
						username: state.username,
						password: state.password,
						email: state.email,
					},
				}
			);
			localStorage.token = response.data.token;
			setIsLoggedIn();

			setState({
				loggedInUser: state.username,
				password: "",
			});
			//history.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		console.log(localStorage.token === false);
		if (localStorage.token != "undefined" && localStorage.token) {
			setIsLoggedIn(true);
		} else {
			setIsLoggedIn(false);
			setState({
				loggedInUser: "",
				username: "",
				password: "",
				email: "",
			});
		}
	}, [isLoggedIn]);

	const handleInput = (event) => {
		setState({ ...state, [event.target.name]: event.target.value });
	};

	const handleLogOut = () => {
		setState({
			username: "",
			password: "",
			email: "",
			loggedInUser: "",
		});
		setIsLoggedIn(false);
		localStorage.clear();
	};

	return (
		<div className="App">
			<div className="container">
				<BrowserRouter>
					<Nav isLoggedIn={isLoggedIn} handleLogOut={handleLogOut} />
					<Switch>
						<Route
							path={`/users/login`}
							render={() => {
								return (
									<Login
										isLoggedIn={isLoggedIn}
										handleInput={handleInput}
										handleLogin={handleLogin}
									/>
								);
							}}
						/>
						<Route
							path={`/users/signup`}
							render={() => {
								return (
									<SignUp
										handleInput={handleInput}
										state={state}
										handleLogin={handleLogin}
										setState={setState}
										isLoggedIn={isLoggedIn}
										setIsLoggedIn={setIsLoggedIn}
									/>
								);
							}}
						/>
						<Route path={`/users/:id/`} component={UserPosts} />
						<Route path={`/posts/new`} component={New} />
						<Route path={`/posts/:id/edit`} component={Edit} />
						<Route
							path={`/posts/:id`}
							component={Show}
							isLoggedIn={isLoggedIn}
						/>
						<Route
							path="/"
							render={() => {
								return <Posts state={state} isLoggedIn={isLoggedIn} />;
							}}
						/>
					</Switch>
				</BrowserRouter>
			</div>
		</div>
	);
}
