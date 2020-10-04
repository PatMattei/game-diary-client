import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dotenv from "dotenv";
import jwt_decode from "jwt-decode";

export default function Posts(props) {
	const [posts, setPosts] = useState([]);
	const [games, setGames] = useState([]);

	const decodedToken = (token) => {
		return jwt_decode(token);
	};

	const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

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
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		(async function () {
			await getGames();
		})();
	}, []);

	return (
		<div>
			<h2>Posts</h2>
			{posts.map((post) => {
				return (
					<div key={post.id} className="post">
						<h3>Date: {post.date}</h3>
						<p>Post ID: {post.id}</p>
						<p>
							Created by User:
							<Link to={`/users/${post.user_id}`}>{post.user.username}</Link>
							<img src={post.user.avatar} className="avatar" />
						</p>
						<p>Entry: {post.entry}</p>
						<div>
							<h4>Games played:</h4>
							{games.map((game) => {
								if (game.post_id === post.id) {
									keyCounter++;
									return (
										<div key={keyCounter}>
											<p>Game Name: {game.name}</p>
											<img src={game.img} />
										</div>
									);
								}
							})}
						</div>
						<Link to={`/posts/${post.id}`}>See Post</Link>

						<hr />
					</div>
				);
			})}
		</div>
	);
}
