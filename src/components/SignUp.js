import React from "react";
import axios from "axios";

export default function SignUp(props) {
	const handleSignUp = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post(
				(process.env.REACT_APP_API_URL || "http://localhost:3000") + "/users",
				{
					user: {
						username: props.state.username,
						password: props.state.password,
					},
				}
			);
			localStorage.token = await response.data.token;
			props.setState({
				username: "",
				password: "",
			});
			props.setIsLoggedIn(true);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form onSubmit={handleSignUp}>
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
