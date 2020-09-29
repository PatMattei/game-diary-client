import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";

import Posts from "./components/Posts.js";
import Show from "./components/Show.js";
import New from "./components/New.js";
import Nav from "./components/Nav.js";

export default function App (props) {
	const [posts, setPosts] = useState([]);

	return (
		<div className="App">
			<div className="container">
				<BrowserRouter>
					<Nav />
					<Switch>
						<Route
							path={`/posts/new`}
							component={New}
						/>
						<Route
							path={`/posts/:id`}
							component={Show}
							posts={posts}
						/>
						<Route
							path="/"
							render={() => {
								return <Posts />;
							}}
						/>
					</Switch>
				</BrowserRouter>
			</div>
		</div>
	);
};