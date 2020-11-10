import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import dotenv from "dotenv";

import ImgUpload from "./ImgUpload";
import { storage } from "./firebase/firebase";

export default function SignUp(props) {
	const history = useHistory();

	const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:3000/";

	const handleSignUp = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post(`${serverUrl}/users`, {
				user: {
					username: props.state.username,
					password: props.state.password,
					email: props.state.email,
					avatar: imageAsUrl.imgUrl,
				},
			});
			console.log(response)
			props.handleLogin(event);

			history.push("/");
		} catch (error) {
			console.log(error);
		}
	};

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
		<form onSubmit={handleSignUp} className="user-form">
			<h1>Create Your Account</h1>
			<label htmlFor="username">Username</label>
			<input
				type="text"
				name="username"
				onChange={props.handleInput}
				required
			/>

			<label htmlFor="email">Email</label>
			<input type="email" name="email" onChange={props.handleInput} required />

			<label htmlFor="password">Password</label>
			<input
				type="password"
				name="password"
				onChange={props.handleInput}
				required
			/>
			<div>
				<input type="file" onChange={handleImageAsFile} />
				<br />
				<img
					src={imageAsUrl.imgUrl || "https://via.placeholder.com/100"}
					alt="avatar"
					className="user_avatar"
				/>
				<button onClick={handleFireBaseUpload}>
					Preview and Upload Avatar
				</button>
			</div>

			<input type="submit" className="submit" value="Sign Up!" />
			<p>
				Already have an account? Log in <a href="/users/login">here.</a>
			</p>
		</form>
	);
}
