import React, {useState} from 'react'
import axios from "axios";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import dotenv from "dotenv";

export default function SignUp(props) {
	const history = useHistory();

	const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

	const handleSignUp = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post(`${serverUrl}/users`, {
				user: {
					username: props.state.username,
					password: props.state.password,
					email: props.state.email,
				},
			});
			props.handleLogin(event);
			history.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form onSubmit={handleSignUp}>
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

			<input type="submit" className="submit" value="Sign Up!" />
			<p>
				Already have an account? Log in <a href="/users/login">here.</a>
			</p>
		</form>
	);
}
