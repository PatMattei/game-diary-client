import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import dotenv from "dotenv";

import Posts from "./components/Posts.js";
import Show from "./components/Show.js";
import New from "./components/New.js";
import Nav from "./components/Nav.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
import Edit from "./components/Edit.js";
import UserPosts from "./components/UserPosts.js";

import { storage } from "./firebase/firebase";

export default function App(props) {
	const allInputs = { imgUrl: "" };
	const [imageAsFile, setImageAsFile] = useState("");
	const [imageAsUrl, setImageAsUrl] = useState(allInputs);

	console.log("Image as file: ", imageAsFile);
	const handleImageAsFile = (e) => {
		const image = e.target.files[0];
		setImageAsFile((imageFile) => image);
	};

	const handleFireBaseUpload = (e) => {
		e.preventDefault();
		console.log("start of upload");
		// async magic goes here...
		if (imageAsFile === "") {
			console.error(`not an image, the image file is a ${typeof imageAsFile}`);
		}
		const uploadTask = storage
			.ref(`/images/${imageAsFile.name}`)
			.put(imageAsFile);
		//initiates the firebase side uploading
		uploadTask.on(
			"state_changed",
			(snapShot) => {
				//takes a snap shot of the process as it is happening
				console.log(snapShot);
			},
			(err) => {
				//catches the errors
				console.log(err);
			},
			() => {
				// gets the functions from storage refences the image storage in firebase by the children
				// gets the download url then sets the image from firebase as the value for the imgUrl key:
				storage
					.ref("images")
					.child(imageAsFile.name)
					.getDownloadURL()
					.then((fireBaseUrl) => {
						setImageAsUrl((prevObject) => ({
							...prevObject,
							imgUrl: fireBaseUrl,
						}));
					});
			}
		);
	};

	return (
		<div className="App">
			<form onSubmit={handleFireBaseUpload}>
				<input type="file" onChange={handleImageAsFile} />
				<button>upload to firebase</button>
			</form>
			<img src={imageAsUrl.imgUrl} alt="image tag" />

		</div>
	);
}

// export default function App(props) {
// 	const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
// 	const history = useHistory();

// 	const [posts, setPosts] = useState([]);
// 	const [state, setState] = useState({
// 		username: "",
// 		password: "",
// 		email: "",

// 	});
// 	const [isLoggedIn, setIsLoggedIn] = useState(false);

// 	const decodedToken = (token) => {
// 		return jwt_decode(token);
// 	};

// 	const handleLogin = async (event) => {
// 		event.preventDefault();
// 		try {
// 			const response = await axios.post(`${serverUrl}/users/login`, {
// 				user: {
// 					username: state.username,
// 					password: state.password,
// 					email: state.email,
// 				},
// 			});
// 			localStorage.token = response.data.token;
// 			setIsLoggedIn();

// 			setState({
// 				loggedInUser: state.username,
// 				password: "",
// 			});
// 			//history.push("/");
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};

// 	useEffect(() => {
// 		if (localStorage.token != "undefined" && localStorage.token) {
// 			setIsLoggedIn(true);
// 		} else {
// 			setIsLoggedIn(false);
// 			setState({
// 				loggedInUser: "",
// 				username: "",
// 				password: "",
// 				email: "",
// 			});
// 		}
// 	}, [isLoggedIn]);

// 	const handleInput = (event) => {
// 		setState({ ...state, [event.target.name]: event.target.value });
// 	};

// 	const handleLogOut = () => {
// 		setState({
// 			username: "",
// 			password: "",
// 			email: "",
// 			loggedInUser: "",
// 		});
// 		setIsLoggedIn(false);
// 		localStorage.clear();
// 	};

// 	return (
// 		<div className="App">
// 			<div className="container">
// 				<BrowserRouter>
// 					<Nav isLoggedIn={isLoggedIn} handleLogOut={handleLogOut} />
// 					<Switch>
// 						<Route
// 							path={`/users/login`}
// 							render={() => {
// 								return (
// 									<Login
// 										isLoggedIn={isLoggedIn}
// 										handleInput={handleInput}
// 										handleLogin={handleLogin}
// 									/>
// 								);
// 							}}
// 						/>
// 						<Route
// 							path={`/users/signup`}
// 							render={() => {
// 								return (
// 									<SignUp
// 										handleInput={handleInput}
// 										state={state}
// 										handleLogin={handleLogin}
// 										setState={setState}
// 										isLoggedIn={isLoggedIn}
// 										setIsLoggedIn={setIsLoggedIn}
// 									/>
// 								);
// 							}}
// 						/>
// 						<Route
// 							path={`/users/:id/`}
// 							component={UserPosts}
// 							serverUrl={serverUrl}
// 							handleInput={handleInput}
// 						/>
// 						<Route path={`/posts/new`} component={New} />
// 						<Route path={`/posts/:id/edit`} component={Edit} serverUrl={serverUrl}/>
// 						<Route
// 							path={`/posts/:id`}
// 							component={Show}
// 							isLoggedIn={isLoggedIn}
// 						/>
// 						<Route
// 							path="/"
// 							render={() => {
// 								return <Posts state={state} isLoggedIn={isLoggedIn} />;
// 							}}
// 						/>
// 					</Switch>
// 				</BrowserRouter>
// 			</div>
// 		</div>
// 	);
// }
