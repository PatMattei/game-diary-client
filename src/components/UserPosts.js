import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dotenv from "dotenv";

export default function Posts(props) {
	const [posts, setPosts] = useState([]);
	const [games, setGames] = useState([]);

	const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

	const id = props.match.params.id;
	let keyCounter = 0;

	const getPosts = async () => {
		try {
			const response = await fetch(`${serverUrl}/posts`);
			const data = await response.json();
			setPosts(data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		(async function () {
			await getPosts();
		})();
	}, []);

	const getGames = async () => {
		try {
			const response = await fetch(`${serverUrl}/games`);
			const data = await response.json();
			setGames(data);

			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		(async function () {
			await getGames();
		})();
	}, []);

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

	const apiLookup = async (guid) => {
		try {
			const response = await axios.post(
				`https://corsanywhere.herokuapp.com/giantbomb.com/api/game/${guid}/?api_key=${process.env.REACT_APP_KEY}&format=json`
			);
			console.log(response.data.results);
			return response.data.results;
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			{/* TODO: add user name at top */}
			<h2>User Posts</h2>
			{posts.map((post) => {
				if (post.user_id == id) {
					return (
						<div key={post.id} className="post">
							<div className="post-top">
								<div className="author-info">
									<img src={post.user.avatar} className="avatar" />
									By:
									<Link to={`/users/${post.user_id}`}>
										{post.user.username}
									</Link>
								</div>
								<div className="date">Date: {post.date}</div>
							</div>
							<p className="entry-text">
								<b>Entry:</b> {post.entry}
							</p>
							<h4>Played:</h4>
							<div className="games">
								{games.map((game) => {
									if (game.post_id === post.id) {
										keyCounter++;
										return (
											<div key={keyCounter} className="game">
												<img src={game.img} />
											</div>
										);
									}
								})}
							</div>
							<Link to={`/posts/${post.id}`}>See Full Post</Link>
						</div>
					);
				}
			})}
		</div>
	);
}
