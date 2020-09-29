import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";

import "./App.css";
import Posts from "./components/Posts.js";
import Show from "./components/Show.js";

const App = () => {
	const [posts, setPosts] = useState([]);
	const [formInputs, updateFormInputs] = useState({
		date: "",
		entry: "",
		hidden: "",
	});

	const handleChange = (event) => {
		const updateInput = Object.assign({}, formInputs, {
			[event.target.id]: event.target.value,
		});
		updateFormInputs(updateInput);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(formInputs);
	};

	return (
		<div className="App">
			<h1>Game Diary</h1>
			<div className="container">
				<BrowserRouter>
					<Switch>
						<Route
							path={`/posts/:id`}
							component={Show}
							posts={posts}
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
};

export default App;
