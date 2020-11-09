import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dotenv from "dotenv";
import jwt_decode from "jwt-decode";

export default function Show(props) {
	const [post, setPost] = useState([]);
	const [games, setGames] = useState([]);

	const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
	const id = props.match.params.id;

	const decodedToken = (token) => {
		return jwt_decode(token);
	};

	const logInCheck = () => {
		console.log(props.isLoggedIn);
		if (localStorage.token != "undefined" && localStorage.token) {
			return decodedToken(localStorage.token).user.id;
		} else {
			return null;
		}
	};

	const getGames = async () => {
		try {
			const response = await fetch(`${serverUrl}/games`);
			const data = await response.json();
			const filteredData = data.filter((game) => game.post_id === parseInt(id));

			setGames(filteredData);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		(async function () {
			await getGames();
		})();
	}, []);

	const getPost = async () => {
		try {
			const response = await fetch(`${serverUrl}/posts/${id}`);
			const data = await response.json();
			setPost(data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		(async function () {
			await getPost();
		})();
	}, []);

	return (
		<div key={post.id} className="post">
			<div className="post-top">
				<div className="author-info">
					<img src={post.user?.avatar} className="avatar" />
					By: <Link to={`/users/${post.user_id}`}>{post.user?.username}</Link>
				</div>
				<div className="date">Date: {post.date}</div>
			</div>
			<p className="entry-text">
				<b>Entry:</b> {post.entry}
			</p>
			<h4>Played:</h4>
			<div className="games">
				{games.map((game) => {
					return (
						<div key={game.id} className="game">
							<img src={game.img} />
						</div>
					);
				})}
			</div>

			<div className="post-bottom">
				<Link to={`/posts`}>Back to index</Link>
				{post.user_id == logInCheck() ? (
					<Link to={`/posts/${id}/edit`}>Edit</Link>
				) : (
					""
				)}
				
			</div>
		</div>
	);
}