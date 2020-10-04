import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from "axios";

export default function Edit(props) {
	const [post, setPost] = useState([]);
	const [formInputs, updateFormInputs] = useState({
		date: post.date,
		entry: post.entry,
		hidden: "",
	});

	const id = props.match.params.id;
	const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

	const handleChange = (event) => {
		const updateInput = Object.assign({}, formInputs, {
			[event.target.id]: event.target.value,
		});
		updateFormInputs(updateInput);
	};

	const handleEdit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.put(
				`${serverUrl}/posts/${id}/`,
				formInputs
			);

			updateFormInputs({
				date: "",
				entry: "",
				hidden: "",
			});
		} catch (error) {
			console.error(error);
		}
	};

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

	const history = useHistory();
	const handleDelete = async (event) => {
		event.preventDefault();

		console.log('trigger')
		axios.delete(
				`${serverUrl}/posts/${id}/`
			);
			history.push("/");
	};

	return (
		<>
			<form onSubmit={handleEdit}>
				<label htmlFor="date">date</label>
				<input
					type="date"
					id="date"
					value={formInputs.date}
					onChange={handleChange}
				/>
				<label htmlFor="entry">entry</label>
				<input
					type="text"
					id="entry"
					value={formInputs.entry}
					onChange={handleChange}
				/>
				<label htmlFor="hidden">Display in public feed?</label>
				<input
					type="checkbox"
					id="hidden"
					value={formInputs.hidden}
					onChange={handleChange}
				/>

				<input type="submit" className="submit" />
			</form>
			<form onSubmit={handleDelete}>
				<input type="submit" className="delete" value="DELETE" />
			</form>
		</>
	);
}
