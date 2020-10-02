import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import axios from "axios";

import Posts from "./components/Posts.js";
import Show from "./components/Show.js";
import New from "./components/New.js";
import Nav from "./components/Nav.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
import Edit from "./components/Edit.js";



export default function App(props) {
	const history = useHistory();
	

	const [posts, setPosts] = useState([]);
	const [state, setState] = useState({
		username: "",
		password: "",
	});
	const [isLoggedIn, setIsLoggedIn] = useState(false);

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
					},
				}
			);
			localStorage.token = response.data.token;
			setIsLoggedIn(true);
			setState({
				username: "",
				password: "",
			});
			//history.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (localStorage.token) {
			console.log("logged in");
			setIsLoggedIn(true);
		} else {
			setIsLoggedIn(false);
		}
		console.log("isLoggedIn: ", isLoggedIn);
	}, [isLoggedIn]);

	const handleInput = (event) => {
		setState({ ...state, [event.target.name]: event.target.value });
	};

	const handleLogOut = () => {
		setState({
			username: "",
			password: "",
		});
		localStorage.clear();
		setIsLoggedIn(false);
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
									<Login handleInput={handleInput} handleLogin={handleLogin} />
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
										setState={setState}
										isLoggedIn={isLoggedIn}
										setIsLoggedIn={setIsLoggedIn}
									/>
								);
							}}
						/>
						<Route path={`/posts/new`} component={New} />
						<Route path={`/posts/:id/edit`} component={Edit} />
						<Route
							path={`/posts/:id`}
							component={Show}
						/>
						<Route
							path="/"
							render={() => {
								return <Posts />;
							}}
						/>
					</Switch>
				</BrowserRouter>
			</div>
		</div>
	);
}
