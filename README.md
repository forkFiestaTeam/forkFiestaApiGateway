# API Gateway for ForkFiesta Microservices

This is a simple API gateway built using Express.js to manage requests and responses between client applications and microservices. The API gateway routes requests to the respective microservices based on the endpoint requested. It is designed to handle various functionalities such as creating orders, retrieving menu items, and managing feedbacks.

## Technologies Used
- **Express.js**: A minimalist web framework for Node.js applications.
- **Axios**: A promise-based HTTP client for making HTTP requests to microservices.
- **CORS**: Cross-Origin Resource Sharing middleware to enable CORS requests.
- **Body-Parser**: Middleware to parse JSON requests and form data.

## Microservices Endpoints

### **Delivery Microservice Endpoints**

#### 1. `POST /write-order`
- Writes order details to the database.
- **Request Body**: Order details.
- **Response**: Order confirmation or error message.

#### 2. `POST /create-order`
- Creates a new order with detailed information.
- **Request Body**: Order details including name, phone, address, order, observations, sauces, juices, and payment method.
- **Response**: Order confirmation or error message.

#### 3. `GET /orders`
- Retrieves all orders from the database.
- **Response**: List of orders or error message.

#### 4. `GET /orders/:id`
- Retrieves a specific order by ID.
- **Response**: Order details or error message.

#### 5. `GET /feedbacks`
- Retrieves all feedback entries.
- **Response**: List of feedback entries or error message.

#### 6. `POST /feedbacks`
- Adds a new feedback entry to the database.
- **Request Body**: Order ID and feedback message.
- **Response**: Feedback confirmation or error message.

### **Menu Microservice Endpoint**

#### 1. `GET /menu`
- Retrieves all food items from the menu.
- **Response**: List of food items or error message.

#### 2. `POST /menu`
- Adds a new food item to the menu.
- **Request Body**: Food item details (name, price, description, category).
- **Response**: Food item addition confirmation or error message.

#### 3. `DELETE /menu/:food_id`
- Deletes a specific food item by ID from the menu.
- **Response**: Deletion confirmation or error message.

## How to Run the API Gateway
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Ensure that the `menuApi` and `deliveryApi` variables point to the correct microservices URLs.
4. Run the Express.js server using `npm run dev`.
5. The API gateway will be accessible at `http://localhost:3000`.

Happy coding!
