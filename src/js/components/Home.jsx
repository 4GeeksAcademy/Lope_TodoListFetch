import React from "react";
import Navbar from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { TodoListFetch } from "./TodoListFetch.jsx";

const Home = () => {
	return (
		<div className="text-center d-flex flex-column min-vh-100">
			<Navbar/>
			<TodoListFetch/>
			<Footer/>
		</div>

	);
};

export default Home;
