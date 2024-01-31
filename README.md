# Trojans_Roomie
Final Project of EE 547 (Applied and Cloud Computing for Engineers). Trojans Roomie venture targets the transient nature of student accommodations and aspires to create harmonious shared living environments through intelligent matching based on courses, interests, and lifestyle preferences.

Welcome to the repository of Trojan Roomie, a full-stack application designed to enhance the roommate finding experience for students. This application is built with React for the frontend and Node.js for the backend, leveraging the MERN stack to provide a seamless user experience.

## Project Repository
[Trojan Roomie](https://github.com/SudeshKumarSK/Trojans_Roomie.git)

## Features

- **User Authentication**: Secure sign-up and login functionality Tradionally and also using Google OAuth.
- **Profile Management**: Users can create and edit their profiles to match with compatible roommates.
- **Roommate Matching**: An intelligent matching system to suggest potential roommates based on user's Spotify Top Tracks, Artists and Genres..
- 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node Version Manager (NVM)**: Use NVM to install and manage Node.js versions. If NVM is not already installed, follow the installation instructions on the [NVM GitHub page](https://github.com/nvm-sh/nvm).

- **Node.js**: This project uses Node.js version `20.9.0`. Install it with NVM using the following commands:

```bash
nvm install 20.9.0
nvm use 20.9.0
```

- npm or Yarn: npm is bundled with Node.js, or you may use Yarn as an alternative. Ensure you have one of these package managers installed.

- MongoDB Atlas: We use MongoDB Atlas to store user data, Spotify data, and user listings data. You will need an Atlas account, which you can set up [here](https://www.mongodb.com/atlas/database).

- Firebase: For storing image data, Firebase is utilized. To set up Firebase storage, visit the [Firebase console.](https://console.firebase.google.com/u/0/)

- Vite: The client-side React application was created using Vite for an optimized build. You can find more information about Vite [here](https://vitejs.dev/guide/).

### Installing

A step-by-step series of examples that tell you how to get a development environment running.

Clone the repository:

```bash
git clone https://github.com/sudeshkumarsk/trojans-roomie.git
cd trojan-roomie
```

Set up the backend server:

```bash
cd server
npm install
npm start
```
Set up the frontend client:


``` bash
cd client
npm install
npm run dev
```

Environment Variables
Create a .env file in both the client and server directories with the following content:

- Client
```bash
VITE_FIREBASE_API_KEY = "Your Firebase API Key"
VITE_SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize?client_id=your_client_id&response_type=code&redirect_uri=localhost:5173/profile&scope=streaming%20user-top-read%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state&show_dialog=true"

```

Once you create a project in Firebase, you will get the Firebase API Key
For Spotify, you can use Spotify Developers Dashboard and create a Porject. In this project you will get your spotify client id. replace that in the above .env file. After you have deploted your prohject, replace the redirect_uri with your deployed url.

- Server:

```bash
MONGO_URI = "Your MONGODB Atlas URI"
PORT = 3000
JWT_SECRET = "Some Random String You can Use"
FIREBASE_SERVICE_ACCOUNT = "base64 converted Firebase service account details"

```
### Deployment
We have deployed our project using google cloud. So you can create an account on gCloud and use gcloud app deploy to deploy this project. make sure to change the redirect uri after deploying the project.
Deployed at https://last-project-407600.wl.r.appspot.com/

### Built With
React - The web framework used
Node.js - The runtime for the backend
Express - The web application framework for Node.js
MongoDB - The database platform used

### Authors
1. [Sudesh Kumar Santhosh Kumar](santhosh@usc.edu)
2. [Zongdao Wen](zongdaow@usc.edu)

### License
This project is licensed under the MIT License - see the LICENSE file for details.



