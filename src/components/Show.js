import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';


export default function Show(props) {
	const [post, setPost] = useState([]);

	const getPost = async () => {
		const id = props.match.params.id;
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
			<Link to={`/posts`}>Back to index</Link>
			<hr />
		</div>
	);
}
