import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import dotenv from "dotenv";
import jwt_decode from "jwt-decode";

export default function Edit(props) {
	const [post, setPost] = useState([]);
	const [apiGames, setApiGames] = useState([]); //games found in API search box
	const [selectedGames, setSelectedGames] = useState([]); //Existing games
	const [newSelectedGames, setNewSelectedGames] = useState([]); //Games weare addign form this EDIT

	const [formInputs, updateFormInputs] = useState({
		date: post.date,
		entry: post.entry,
		hidden: "",
		search: "",
	});

	const id = props.match.params.id;
	let keyCounter = 0;

	const history = useHistory();
	const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

	const decodedToken = (token) => {
		return jwt_decode(token);
	};

	const handleChange = (event) => {
		const updateInput = Object.assign({}, formInputs, {
			[event.target.id]: event.target.value,
		});
		updateFormInputs(updateInput);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.put(`${serverUrl}/posts/${id}/`, formInputs);

			updateFormInputs({
				date: "",
				entry: "",
				hidden: "",
				search: "",
			});
			let result = await response; // wait until the promise resolves (*)
			if (result) {
				newSelectedGames.forEach((game) => {
					handleGameSubmit(game, result);
				});
			}
			history.push(`/posts/${id}`);
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
		} catch (error) {
			console.error(error);
		}
	};

	const getPost = async () => {
		try {
			const response = await fetch(`${serverUrl}/posts/${id}`);
			const data = await response.json();
			console.log(data);

			updateFormInputs(data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		(async function () {
			await getPost();
			await getGames();
		})();
	}, []);

	const getGames = async () => {
		try {
			const response = await fetch(`${serverUrl}/games/`);
			const data = await response.json();
			const filteredData = data.filter((game) => game.post_id === parseInt(id));

			setSelectedGames(filteredData);
		} catch (error) {
			console.error(error);
		}
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
			setApiGames(searchData);
		} catch (error) {
			console.error(error);
		}
	};

	const handleNewSelectedGames = (event) => {
		setNewSelectedGames([
			...newSelectedGames,
			{
				api_ref: event.target.getAttribute("api_ref"),
				name: event.target.getAttribute("name"),
				img: event.target.getAttribute("img"),
				post_id: id,
			},
		]);
		setApiGames([]);
	};

	const handleDelete = async (event) => {
		event.preventDefault();
		axios.delete(`${serverUrl}/posts/${id}/`);
		history.push("/");
	};

	const handleDeleteGame = async (event) => {
		event.preventDefault();
		const gameId = event.target.getAttribute("id");

		axios.delete(`${serverUrl}/games/${gameId}/`);
		setSelectedGames([]);
		getGames();
	};

	return (
		<div className="game-form">
			<h2>Edit</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="date">date</label>
				<input
					type="date"
					id="date"
					value={formInputs.date}
					onChange={handleChange}
				/>
				<label htmlFor="entry">entry</label>
				<textarea id="entry" value={formInputs.entry} onChange={handleChange} />

				<input type="submit" className="submit" className="submit-btn submit-post" value="Submit Post"/>
			</form>

			<ul className="selectedGames">
				{selectedGames.map((game) => {
					return (
						<li key={game.id}>
							<img src={game.img} />
							<input
								type="submit"
								className="delete"
								value="Remove Game"
								id={game.id}
								onClick={handleDeleteGame}
							/>
						</li>
					);
				})}
				{newSelectedGames.map((game) => {
					keyCounter++;
					return (
						<li key={keyCounter}>
							<img src={game.img} />
						</li>
					);
				})}
			</ul>

			<form onSubmit={handleDelete}>
				<input type="submit" className="delete" value="DELETE POST" />
			</form>

			<form onSubmit={handleSearch}>
				<label htmlFor="search">Search</label>
				<input
					type="text"
					id="search"
					value={formInputs.search}
					onChange={handleChange}
				/>
				<input type="submit" className="submit" value="Search" />
			</form>

			<div id="searchBox">
				{apiGames.map((game) => {
					return (
						<div key={game.guid} className="game">
							<img src={game.image.original_url} />
							<input
								type="button"
								value="Add game to Post"
								api_ref={game.guid}
								name={game.name}
								img={game.image.original_url}
								onClick={handleNewSelectedGames}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
