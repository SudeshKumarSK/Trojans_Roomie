# Trojans_Roomie

Final Project of EE 547 (Applied and Cloud Computing for Engineers). Trojans Roomie venture targets the transient nature of student accommodations and aspires to create harmonious shared living environments through intelligent matching based on courses, interests, and lifestyle preferences. Trojans_Roomie is a comprehensive full-stack web application designed to [provide a brief description of the application's purpose and functionalities]. The project structure separates front-end and back-end concerns into `client` and `server` directories, respectively, offering a clear and manageable development environment.

## Repository Structure

- **Client**: Contains all front-end code, developed with React.
- **Server**: Houses back-end code, built using Node.js.
- **Firebase Config**: `trojan-roomie-firebase-adminsdk-3qifd-cf2f98c5d7.json` is used for Firebase integration, essential for backend services.

### Client Directory

- **Environment Variables**: `.env` file for front-end specific configurations.
- **NPM Packages**: `package.json` and `package-lock.json` manage front-end dependencies.
- **Source Code**: `src` directory containing React components, styles, and other front-end assets.
- **Configuration Files**: Various configuration files for linting, styling, and building the front-end project.

### Server Directory

- **Environment Variables**: `.env` file for server configurations.
- **NPM Packages**: `package.json` and `package-lock.json` for back-end dependencies.
- **Entry Point**: `index.js` serves as the starting point of the back-end application.
- **Core Components**: `controllers`, `models`, `routes`, and `utils` directories organizing the back-end logic and functionalities.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- Firebase account setup for backend integration.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SudeshKumarSK/Trojans_Roomie.git
   cd Trojans_Roomie
   ```

2. **Set Up the Server:**

   Navigate to the `server` directory and install dependencies:

   ```bash
   cd server
   npm install
   ```

   Start the server:

   ```bash
   npm start
   ```

3. **Set Up the Client:**

   In a new terminal, navigate to the `client` directory and install dependencies:

   ```bash
   cd client
   npm install
   ```

   Start the client application:

   ```bash
   npm start
   ```

   The front-end should now be accessible, on `http://localhost:3000`.

### Deployment

https://last-project-407600.wl.r.appspot.com/
