import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';


export default function Show(props) {
	const [post, setPost] = useState([]);
	const [games, setGames] = useState([]);


	const id = props.match.params.id;

	const getGames = async () => {
		try {
			const response = await fetch(`http://localhost:3000/games`);
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
			const response = await fetch(`http://localhost:3000/posts/${id}`);
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
			<p>Created by User: {post.user?.username}</p>
			<p>Entry: {post.entry}</p>
			<p>Games Played: </p>
			{games.map(game => {
				return (
					<div key={game.id}>
						<p>Game entry ID: {game.id}</p>
						<p>Game api_ref: {game.api_ref}</p>
						<p>Game entry: {game.entry}</p>
						<hr />
					</div>
				)
			})}
			<Link to={`/posts`}>Back to index</Link>
			<hr />
		</div>
	);
}
