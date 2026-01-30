# Gemini Project Overview: InkMaster Tattoo Studio

This document provides an overview of the "InkMaster Tattoo Studio" web application, designed to serve as instructional context for future interactions with the Gemini CLI.

## Project Overview

The "InkMaster Tattoo Studio" is a Node.js web application built using the Express.js framework. It functions as a catalog for tattoo sketches (referred to as products or services) and incorporates robust features for user management and API exposure.

**Key Technologies:**
*   **Backend:** Node.js, Express.js
*   **Database:** MySQL (managed with Sequelize ORM)
*   **Templating:** EJS (Embedded JavaScript)
*   **Authentication:** Session-based with `express-session`, password hashing via `bcryptjs`.
*   **API Documentation:** Swagger UI.

**Core Features:**
*   **User Authentication:** Secure login and logout functionality using sessions.
*   **Role-Based Authorization:** Distinguishes between `admin` users (with full CRUD access) and `user` roles (view-only access).
*   **Product Catalog:** Displays a list of tattoo sketches with details like name, description, style, price, and images.
*   **Admin Panel:** Provides full CRUD (Create, Read, Update, Delete) interface for managing tattoo sketches.
*   **RESTful API:** A dedicated API for interacting with tattoo sketch data, protected by role-based access control.
*   **Swagger Documentation:** The REST API is self-documented and explorable via Swagger UI.

## Building and Running

### Prerequisites

*   **Node.js:** Version 18 or higher.
*   **MySQL Server:** A running MySQL instance. XAMPP, WAMP, or Docker are recommended for local development.

### Installation

1.  **Clone the repository** (if not already done).
2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Configuration:**
    Create a `.env` file in the project root based on `.env.example`.
    The following environment variables are used:
    *   `DB_HOST`: MySQL host (default: `localhost`)
    *   `DB_PORT`: MySQL port (default: `3306`)
    *   `DB_USER`: MySQL username (default: `root`)
    *   `DB_PASS`: MySQL password (default: `''`)
    *   `DB_NAME`: Database name (default: `InkMasterDB`)
    *   `SESSION_SECRET`: Secret key for Express sessions (default: `dev_secret`)
    *   `PORT`: Application port (default: `3000`)

### Running the Application

*   **Development Mode (with `nodemon` for auto-restarts):**
    ```bash
    npm run dev
    ```
*   **Production Mode:**
    ```bash
    npm start
    ```

Once running, the application will be accessible at `http://localhost:<PORT>` (default `http://localhost:3000`).

**Key Endpoints:**
*   **Web Application:** `/` (homepage), `/login` (authentication), `/products/*` (admin CRUD).
*   **REST API:** `/api/products`, `/api/products/:id`.
*   **API Documentation (Swagger UI):** `/api-docs`
*   **Swagger JSON:** `/swagger.json`

**Database Initialization:**
The application automatically initializes the database on startup. If the `products` table is empty, it will seed initial tattoo sketch data.

## Development Conventions

**Project Structure:**
*   `app.js`: Main application entry point, setting up Express, middleware, and routing.
*   `config/database.js`: Handles MySQL connection and Sequelize instance creation, including automatic database creation.
*   `models/`: Contains Sequelize model definitions (`User.js`, `Product.js`) and the `index.js` file for database initialization and model synchronization.
*   `controllers/`: Contains the logic for handling HTTP requests for both web views (`authController.js`, `productController.js`) and the REST API (`productApiController.js`).
*   `routes/`: Defines application routes. `web.js` for traditional web pages and `api.js` for the RESTful API.
*   `middleware/auth.js`: Implements authentication (`requireAuth`) and authorization (`requireAdmin`) middleware.
*   `views/`: EJS templates for rendering web pages.
*   `public/`: Static assets such as CSS files and images.
*   `swagger.json`: OpenAPI/Swagger definition for the REST API.

**Authentication and Authorization:**
*   Authentication is session-based, relying on `express-session`.
*   Passwords are securely stored using `bcryptjs` for hashing.
*   Authorization is role-based, differentiating between `admin` and `user` roles.
*   Custom middleware (`requireAuth`, `requireAdmin`) protects routes based on user session and role.

**API Design:**
*   The API follows RESTful principles for managing product resources.
*   API endpoints are accessible under the `/api` prefix.
*   Access to modify product data via the API is restricted to `admin` users only.

**Configuration:**
*   Uses `.env` files for managing environment-specific configurations, such as database credentials and session secrets.
