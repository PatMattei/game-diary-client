import React from "react";
import { Link } from "react-router-dom";


function Footer(props) {
	return (
		<footer>
			<p>Created by <a href="https://patrickmattei.com/">Patrick Lines-Mattei</a>.</p>
			<p>Game data provided by the <a href="https://www.giantbomb.com/api/">Giant Bomb API</a>.</p>
		</footer>
	)
}


export default Footer;