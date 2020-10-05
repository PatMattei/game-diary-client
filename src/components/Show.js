import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dotenv from "dotenv";
import axios from "axios";
import jwt_decode from "jwt-decode";

export default function Show(props) {
	const [post, setPost] = useState([]);
	const [games, setGames] = useState([]);
	const [comments, setComments] = useState([]);
	const [formInputs, setFormInputs] = useState({
		comment: "",
	});

	const handleChange = (event) => {
		const updateInput = Object.assign({}, formInputs, {
			[event.target.id]: event.target.value,
		});
		setFormInputs(updateInput);
	};

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

	const getComments = async () => {
		try {
			const response = await fetch(`${serverUrl}/comments`);
			const data = await response.json();

			setComments(data);
		} catch (error) {
			console.error(error);
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
			await getComments();
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

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post(`${serverUrl}/comments`, {
				comment: {
					entry: formInputs.newComment,
					post_id: id,
					user_id: parseInt(decodedToken(localStorage.token).user.id),
				},
			});

			setFormInputs({
				newComment: "",
			});

			getComments();

			let result = await response; // wait until the promise resolves (*)
			console.log(result);
		} catch (error) {
			console.error(error);
		}
	};

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

			<div className="comments">
				<h4>Comments:</h4>
				{comments.map((comment) => {
					if (comment.post_id == id) {
						return (
							<div key={comment.id} className="comment">
								<img src={comment.user?.avatar} className="avatar" />
								<b>Comment by: {comment.user?.username} </b>
								<p>{comment.entry}</p>
							</div>
						);
					}
				})}
			</div>

			{localStorage.token != "undefined" && localStorage.token ? (
				<form onSubmit={handleSubmit}>
					<label htmlFor="newComment">Post a Comment:</label>
					<textarea
						type="text"
						id="newComment"
						value={formInputs.newComment}
						onChange={handleChange}
					/>
					<br />

					<input
						type="submit"
						className="submit"
						className="submit-btn submit-post"
						value="Submit A Comment"
					/>
				</form>
			) : (
				""
			)}
		</div>
	);
}
