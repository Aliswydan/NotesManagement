# NotesManagement

## Description
NotesManagement is a simple yet powerful application designed to help you manage your notes efficiently. This project includes both server-side and client-side components.

---

## How to Run the Project

Follow these steps to set up and run the project:

---

### 1. Set Up the PostgreSQL Database

Before running the application, ensure you have a PostgreSQL database set up. Follow these steps:

1. Install PostgreSQL if it's not already installed on your system.
2. Create a new database. You can name it, for example, `notesmanagement`.
3. Update the database connection details (host, port, username, password, and database name) in the `server` configuration file (e.g., `.env` or `config` file).

   Example `.env` file:

`
   DB_HOST=localhost 
   DB_PORT=your_port 
   DB_USER=your_username 
   DB_PASSWORD=your_password 
   DB_NAME=notesmanagement 
`

---

### 2. Install Dependencies

First, you need to install all the necessary dependencies for both the server and client components.

#### cd server
>  npm install

#### cd client 
>  npm install

---

### 3. Start the Development Servers

After installing the dependencies, return to the root directory and start the development servers for both the client and server:

#### cd ..
>  npm install
>  npm start

---

### 4. Access the Application

Once the servers are running:
- Open your browser and navigate to the client-side application URL (usually `http://localhost:3000`).
- Ensure your server is running properly and connected to the PostgreSQL database.

---