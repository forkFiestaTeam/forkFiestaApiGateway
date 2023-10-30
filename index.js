const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Sample microservices endpoints
const menuApi = 'http://localhost:4000';
const deliveryApi = 'http://127.0.0.1:5000/api/forkfiesta';

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
	try {
		const response = await axios.get(`${deliveryApi}/orders`);
		res.json(response.data);
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

		// Encode the query and append it as a URL parameter
		const encodedQuery = encodeURIComponent(query);

		// Make the GET request using Axios
		const response = await axios.get(`${menuApi}?query=${encodedQuery}`);

		res.json(response.data.data);
	} catch (error) {
		res.status(500).json({error: 'Internal Server Error'});
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`API Gateway listening on port ${PORT}`);
});
