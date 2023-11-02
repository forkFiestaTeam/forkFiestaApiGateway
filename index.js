const express = require('express');
const cors = require('cors');
require('dotenv').config()

const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());

// Sample microservices endpoints
const menuApi = process.env.MENU_API;
const deliveryApi = process.env.DELIVERY_API;
const userApi = process.env.USER_API;
const PORT = process.env.PORT || 3001;

console.log('Running Menu API at', menuApi);
console.log('Running Delivery API at', deliveryApi);
console.log('Running UserManagement API at', userApi);

// Enable All CORS Requests
app.use(cors());

// Middleware to parse JSON requests and form data
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// ROUTES FOR DELIVERY MICROSERVICE
app.post('/write-order', async (req, res) => {
	try {
		const response = await axios.post(`${deliveryApi}/write-order`, req.body);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: 'Internal Server Error', err: error});
	}
});

// ROUTES FOR DELIVERY MICROSERVICE
app.post('/create-order', async (req, res) => {
	try {
		let {name, phone, address, order, observations, sauces, juices, payment_method} = req.body;

		const formData = new FormData();
		formData.append('name', name);
		formData.append('phone', phone);
		formData.append('address', address);
		formData.append('order', order);
		formData.append('observations', observations);
		formData.append('sauces', sauces);
		formData.append('juices', juices);
		formData.append('payment_method', payment_method);

		const response = await axios.post(`${deliveryApi}/create-order`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		res.json(response.data);
		// res.json({message: 'ok'});
	} catch (error) {
		res.status(500).json({error: 'Internal Server Error', err: error});
	}
});

app.get('/orders', async (req, res) => {
	console.log('GET /user-orders');
	try {
		const response = await fetch(`${deliveryApi}/orders`);
		const data = await response.json();
		res.json(data.message);
	} catch (error) {
		res.status(500).json({error: 'Internal Server Error'});
	}
});

app.get('/orders/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const response = await axios.get(`${deliveryApi}/order?id=${id}`);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: 'Internal Server Error'});
	}
});

app.get('/feedbacks', async (req, res) => {
	try {
		const response = await axios.get(`${deliveryApi}/feedbacks`);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: 'Internal Server Error'});
	}
});

app.post('/feedbacks', async (req, res) => {
	try {
		const {order_id, feedback} = req.body;

		const formData = new FormData();
		formData.append('order_id', order_id);
		formData.append('feedback', feedback);

		const response = await axios.post(`${deliveryApi}/feedbacks`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: 'Internal Server Error'});
	}
});

// ROUTES FOR MENU MICROSERVICE
app.get('/menu', async (req, res) => {
	console.log('GET /menu');
	try {
		// Construct the GraphQL query
		const query = `
		query  {
			foods {
				id
				name
				price
				description
				category
			}
		}
	  `;

		// Make the GET request using Axios
		const response = await axios.post(menuApi, {
			query
		});

		res.json(response.data.data);
	} catch (error) {
		res.status(500).json({error: 'Internal Server Error'});
	}
});

app.post('/menu', async (req, res) => {
	try {

		const {name, price, description, category} = req.body

		// Construct the GraphQL query to add a food
		const query = `
		mutation {
			addFood(name: "${name}", price: ${price}, description: "${description}", category: "${category}") {
				id
				name
				price
				description
				category
			}
		}
	  `;

		// Make the GET request using Axios
		const response = await axios.post(menuApi, {
			query
		});

		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: 'Internal Server Error.', err: error});
	}
});

app.delete('/menu/:food_id', async (req, res) => {
	try {

		const {food_id} = req.params

		// Construct the GraphQL query to add a food
		const query = `
		mutation {
			deleteFood(id: "${food_id}") {
					id
					name
				}
			}
	  `;

		// Make the GET request using Axios
		const response = await axios.post(menuApi, {
			query
		});

		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: 'Internal Server Error.', err: error});
	}
});

// ROUTES FOR USER MANAGEMENT MICROSERVICE
app.get("/users", async (req, res) => {
	console.log("GET /users");
	try {
		const response = await axios.get(`http://localhost:3002/users`);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
})

app.get("/users/:id", async (req, res) => {
	console.log("GET /user/:id");
	try {
		const id = req.params.id;
		const response = await axios.get(`${userApi}/users/${id}`);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
});

app.post("/create-user", async (req, res) => {
	console.log("POST /create-user");
	try {
		const {id, name, email} = req.body;

		const response = await axios.post(`${userApi}/create-user`, {id, name, email}, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
})

app.post("/update-user", async (req, res) => {
	try {
		const {name, email} = req.body;

		const response = await axios.post(`${userApi}/update-user`, {name, email}, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
})

app.post("/delete-user", async (req, res) => {
	try {
		const {id} = req.body;

		const formData = new FormData();
		formData.append("id", id);

		const response = await axios.post(`${userApi}/delete-user`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
})

app.get("/address", async (req, res) => {
	console.log("GET /address");
	try {
		const response = await axios.get(`${userApi}/address`);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
});

app.get("/address/:id", async (req, res) => {
	console.log("GET /address/:id");
	try {
		const id = req.params.id;
		const response = await axios.get(`${userApi}/address/${id}`);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
});

app.post("/create-address", async (req, res) => {
	console.log("POST /create-address");
	try {
		const {user_id, name, address, address_details, phone, city} = req.body;

		const response = await axios.post(`${userApi}/create-address`, {user_id, name, address, address_details, phone, city}, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		res.json(response.data);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
});





// Start the server
app.listen(PORT, () => {
	console.log(`\nAPI Gateway listening on port ${PORT}`);
});
