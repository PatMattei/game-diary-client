import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dotenv from "dotenv";

export default function Posts(props) {
	const [posts, setPosts] = useState([]);
	const [games, setGames] = useState([]);

	const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

	const id = props.match.params.id;

	const getPosts = async () => {
		try {
			const response = await fetch(`${serverUrl}/posts`);
			const data = await response.json();
			setPosts(data);
			console.log(data);
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

	const apiLookup = async (guid) => {
		try {
			const response = await axios.post(
				`https://cors-anywhere.herokuapp.com/giantbomb.com/api/game/${guid}/?api_key=${process.env.REACT_APP_KEY}&format=json`
			);
			console.log(response.data.results);
			return response.data.results;
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<h2>View Posts</h2>
			{posts.map(post => {
				if (post.user_id == id) {
					return (
						<div key={post.id} className="post">
							<img src={post.user?.avatar} className="avatar" />
							<h3>Date: {post.date}</h3>
							<p>Created by User: {post.user.username}</p>
							<p>Entry: {post.entry}</p>
							<Link to={`/posts/${post.id}`}>See Post</Link>
							{games.forEach((game) => {
								if (game.post_id === post.id) {
									return <p>Game Entry ID: {game.id}</p>;
								}
							})}
							<hr />
						</div>
					);
				}
			})}
		</div>
	);
}
