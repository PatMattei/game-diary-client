import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';


export default function Posts(props) {
	const [posts, setPosts] = useState([]);
	const getPosts = async () => {
		try {
			const response = await fetch("http://localhost:3000/posts");
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
			<h2>Posts</h2>
			{posts.map((post) => {
				console.log(post)
				return (
					<div key={post.id} className="post">
						<h3>Date: {post.date}</h3>
						<p>Post ID: {post.id}</p>
						<p>Created by: User: {post.user.username}</p>
						<p>Entry: {post.entry}</p>
						<Link to={`/posts/${post.id}`}>See Post</Link>
						<hr />
					</div>
				);
			})}
		</div>
	);
}
