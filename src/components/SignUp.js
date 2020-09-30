import React from "react";

export default function SignUp(props) {
	return (
		<form onSubmit={props.handleSignUp}>
			<h1>Create Your Account</h1>
			<label htmlFor="username">USERNAME</label>
			<input type="text" name="username" onChange={props.handleInput} />


			<label htmlFor="password">PASSWORD</label>
			<input type="password" name="password" onChange={props.handleInput} />
			
			<input type="submit" className="submit" value="Sign Up!" />
			<p>
				Already have an account? Log in <a href="/users/login">here.</a>
			</p>
		</form>
	);
}
