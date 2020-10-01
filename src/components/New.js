import React, { useState, useEffect } from "react";
import axios from "axios";
import dotenv from "dotenv";

export default function New(props) {
	const [formInputs, updateFormInputs] = useState({
		date: "",
		entry: "",
		hidden: "",
		search: ""
	});
	const [games, setGames] = useState([]);

	const handleChange = (event) => {
		const updateInput = Object.assign({}, formInputs, {
			[event.target.id]: event.target.value,
		});
		updateFormInputs(updateInput);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:3000/posts",
				(
					[formInputs.date, formInputs.entry, formInputs.hidden]
				)
			);
			const data = response.data;

			updateFormInputs({
				date: "",
				entry: "",
				hidden: "",
				search: ""
			});
		} catch (error) {
			console.error(error);
		}
	};

	var cors_api_url = "https://cors-anywhere.herokuapp.com/";
	function doCORSRequest(options, printResult) {
		var x = new XMLHttpRequest();
		x.open(options.method, cors_api_url + options.url);
		x.onload = x.onerror = function () {
			printResult(
				options.method +
					" " +
					options.url +
					"\n" +
					x.status +
					" " +
					x.statusText +
					"\n\n" +
					(x.responseText || "")
			);
		};
		if (/^POST/i.test(options.method)) {
			x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		x.send(options.data);
	}


	const handleSearch = async (event) => {
		let searchString =  `https://cors-anywhere.herokuapp.com/giantbomb.com/api/search/?format=json&resources=game&api_key=${process.env.REACT_APP_KEY}&limit=100&query=${formInputs.search}`

		event.preventDefault();
		try {
			const response = await axios.post(
				searchString
			);
			const searchData = response.data.results;
			console.log(searchData)
			setGames(searchData);

			updateFormInputs({
				search: "",
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label htmlFor="date">date</label>
				<input
					type="date"
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

			<form onSubmit={handleSearch}>
				<label htmlFor="search">Search</label>
				<input
					type="text"
					id="search"
					value={formInputs.search}
					onChange={handleChange}
				/>
				<input type="submit" className="submit" />
			</form>
			<div id="searchBox">
				{games.map(game => {
					return (
						<div key={game.guid}>
							<p>Game entry ID: {game.guid}</p>
							<p>Game Name: {game.name}</p>
						</div>
					)
				})}
			</div>
		</>
	);
}
