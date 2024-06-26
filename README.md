# Fchat

Fchat is a real-time messaging application with a robust authentication system. It consists of three separate applications:
- [an authentication app](https://auth-fchat.mfry.io)
- [a web chat app](https://fchat.mfry.io)
- an API.
The authentication and chat apps are built with Angular, and the API is developed in Node.js and TypeScript using a custom framework ( [apigen](https://mfry.io)) 

## Features

### Authentication App
- **Sign Up**: Create a new account with a unique email and password.
- **Log In**: Authenticate with your credentials to access the chat.
- **Forgot Password**: Request a password reset link if you forget your password.
- **Reset Password**: Update your password using the reset link sent to your email.

### Web Chat App
- **Real-Time Messaging**: Exchange messages in real-time with other users.
- **Profile Description**: Add or update your profile description.
- **Profile Picture**: Upload and update your profile picture.

## Installation

### Prerequisites
- Node.js
- Angular CLI
- TypeScript
- Docker

### Setup

1. **Run the services**
   
    ```sh
    docker run -d frymarshall/web-services-local:latest
    ```
1. **Clone the repository**
    ```sh
    git clone https://github.com/fry-marshall/fchat-project.git
    ```
    ```sh
    cd fchat-project
    ```

2. **Install dependencies for the API**
    ```sh
    cd api-fchat
    npm install
    ```

3. **Install dependencies for the Authentication and Chat apps**
    ```sh
    cd ../auth-fchat
    npm install
    cd ../chat-fchat
    npm install
    ```

## Running the Applications

### Start the API
```sh
cd api-fchat
make dev
```

### Start the Auth
```sh
cd auth-fchat
make dev
```
Local url: https://fchatauth.local.com

### Start the Webapp
```sh
cd webapp-fchat
make dev
```
Local url: https://fchatwebapp.local.com

### License

This project is licensed under the MIT License.


### Contact

For any questions or suggestions, please contact me at marshalfry1998@gmail.com.
