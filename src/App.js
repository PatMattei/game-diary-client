import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import "./App.css";
import Posts from "./components/Posts.js";
import Show from "./components/Show.js";


function App() {
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
				<form onSubmit={handleSubmit}>
					<label htmlFor="date">date</label>
					<input
						type="text"
						id="date"
						value={formInputs.date}
						onChange={handleChange}
					/>
					<label htmlFor="entry">entry</label>
					<input
						type="text"
						id="entry"
						value={formInputs.entry}
						onChange={handleChange}
					/>
					<label htmlFor="hidden">Display in public feed?</label>
					<input
						type="checkbox"
						id="hidden"
						value={formInputs.hidden}
						onChange={handleChange}
					/>
					<input type="submit" className="submit" />
				</form>

				<main>
					<Posts />
				</main>
			</div>
		</div>
	);
}

export default App;
