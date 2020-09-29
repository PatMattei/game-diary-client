import React from "react";

export default function Login (props) {
	
	return (
		<form onSubmit={props.handleLogin}>
            <h1>Log In</h1>
			<label>Username</label>
			<input type="text" name="username" onChange={props.handleInput} />


			<label>Password</label>
			<input type="password" name="password" onChange={props.handleInput} />

			<input type="submit" className="submit" value="Login"/>
        </form>
	)
}