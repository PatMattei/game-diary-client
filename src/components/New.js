import React, { useState, useEffect } from "react";
import axios from "axios";

export default function New(props) {
	const [formInputs, updateFormInputs] = useState({
		date: "",
		entry: "",
		hidden: "",
	});

	const handleChange = (event) => {
		const updateInput = Object.assign({}, formInputs, {
			[event.target.id]: event.target.value,
		});
		updateFormInputs(updateInput);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:3000/posts",
				formInputs
			);
			const data = response.data;
			updateFormInputs({
				date: "",
				entry: "",
				hidden: "",
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="date">date</label>
			<input
				type="text"
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
	);
}
