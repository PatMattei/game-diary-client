import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import dotenv from "dotenv";
import jwt_decode from "jwt-decode";

export default function New(props) {
	const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
	const history = useHistory();
	let keyCounter = 0;

	
	const decodedToken = (token) => {
		return jwt_decode(token);
	};

	const [formInputs, setFormInputs] = useState({
		date: "",
		entry: "",
		hidden: false,
		search: "",
	});
	const [games, setGames] = useState([]);
	const [selectedGames, setSelectedGames] = useState([]);

	const handleChange = (event) => {
		const updateInput = Object.assign({}, formInputs, {
			[event.target.id]: event.target.value,
		});
		setFormInputs(updateInput);
	};


	var cors_api_url = "https://corsanywhere.herokuapp.com/";
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
		let searchString = `https://corsanywhere.herokuapp.com/giantbomb.com/api/search/?format=json&resources=game&api_key=${process.env.REACT_APP_KEY}&limit=100&query=${formInputs.search}`;

		event.preventDefault();
		try {
			const response = await axios.post(searchString);
			const searchData = response.data.results;
			setGames(searchData);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSelectedGames = (event) => {
		setSelectedGames([
			...selectedGames,
			{
				api_ref: event.target.getAttribute('api_ref'),
				name: event.target.getAttribute('name'),
				img: event.target.getAttribute('img'),
				post_id: ''
			}
		])
		setGames([]);
	};



	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post(`${serverUrl}/posts`, {
				post: {
					date: formInputs.date,
					entry: formInputs.entry,
					hidden: false, //TODO- send this through properfly or get rid of field
					user_id: decodedToken(localStorage.token).user.id,
				},
			});

			setFormInputs({
				date: "",
				entry: "",
				hidden: "",
				search: "",
			});

			let result = await response; // wait until the promise resolves (*)

			if (result) {
				selectedGames.forEach(game => {
					handleGameSubmit(game, result)
				})
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleGameSubmit = async (game, response) => {
		game.post_id = response.data.id;
		try {
			const response = await axios.post(`${serverUrl}/games`, {
				game: game,
			});
			console.log(response);
			history.push(`/users/${decodedToken(localStorage.token).user.id}`);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="game-form">
			<h2>New Post</h2>
			<form onSubmit={handleSubmit} >
				<label htmlFor="date">date</label>
				<input
					type="date"
					id="date"
					value={formInputs.date}
					onChange={handleChange}
				/><br />

				<label htmlFor="entry">entry</label>
				<textarea
					type="text"
					id="entry"
					value={formInputs.entry}
					onChange={handleChange}
				/>
				<br/>

				<input type="submit" className="submit-btn submit-post" value="Submit Post"/>
			</form>

			<p><b>Today I played....</b></p>

			<ul className="selectedGames games">
				{selectedGames.map(game => {
					keyCounter++
					return (
						<li key={keyCounter} className="game">
							<img src={game.img} />
						</li>
					)
				})}
			</ul>

			<form onSubmit={handleSearch}>
				<label htmlFor="search">Search</label>
				<input
					type="text"
					id="search"
					value={formInputs.search}
					onChange={handleChange}
				/>
				<input type="submit" className="submit" value="Search" className="submit-btn"/>
			</form>

			<div id="searchBox">
				{games.map(game => {
					return (
						<div key={game.guid} className="game">
							<img src={game.image.original_url} />
							<input
								type="button"
								value="Add game to Post"
								api_ref={game.guid}
								name={game.name}
								img={game.image.original_url}
								onClick={handleSelectedGames}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
