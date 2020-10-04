import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';


export default function Show(props) {
	const id = props.match.params.id;
	const [posts, setPosts] = useState([]);

	const getPosts = async () => {
		console.log(posts)
		try {
			const response = await fetch(`http://localhost:3000/posts/${id}`);
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
	
	return (
		<div>
			<h2>Post Show</h2>
			<h3>Date: {posts.date}</h3>
			<p>Post ID: {posts.id}</p>
			<p>Created by: User ID: {posts.user_id}</p>
			<p>Entry: {posts.entry}</p>
			<Link to={`/posts`}>Back to index</Link>
			<hr />
		</div>
	);
}
