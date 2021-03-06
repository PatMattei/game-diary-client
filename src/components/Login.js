import React from "react";

export default function Login(props) {
	return (
		<form onSubmit={props.handleLogin} className="user-form">
			<h1>Log In</h1>
			<label htmlFor="username">Username</label>
			<input type="text" name="username" onChange={props.handleInput} />

			<label htmlFor="password">Password</label>
			<input type="password" name="password" onChange={props.handleInput} />

			<input type="submit" className="submit" value="Login" />
		</form>
	);
}
