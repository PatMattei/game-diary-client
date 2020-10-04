import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
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
		console.log(props.isLoggedIn)
		if (localStorage.token != "undefined" && localStorage.token) {
			return decodedToken(localStorage.token).user.id
		} else {
			return null;
		}
	};
	
	

	const getGames = async () => {
		try {
			const response = await fetch(`${serverUrl}/games`);
			const data = await response.json();
			const filteredData = data.filter(game => game.post_id === parseInt(id));
			
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
		<div>
			<h2>Post Show</h2>
			<h3>Date: {post.date}</h3>
			<p>Created by User: <Link to={`/users/${post.user_id}`}>{post.user?.username}</Link></p>
			<img src={post.user?.avatar} className="avatar" />
			
			<p>Entry: {post.entry}</p>
			<p>Games Played: </p>
			{games.map(game => {
				return (
					<div key={game.id}>
						<p>Game Name: {game.name}</p>
						<img src={game.img} />
						<hr />
					</div>
				)
			})}
			
			{post.user_id == logInCheck() ? <Link to={`/posts/${id}/edit`}>Edit</Link> : ''}
			<Link to={`/posts`}>Back to index</Link>
			<hr />
		</div>
	);
}
