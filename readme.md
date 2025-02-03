


## Project Explanation

This project demonstrates a passwordless authentication system using WebAuthn and FIDO2 standards. The goal is to provide a secure and user-friendly authentication mechanism without relying on traditional passwords.

### Key Components

- **client/index.html**: The main HTML file that serves the frontend of the application.
- **client/main.js**: The JavaScript file that handles the WebAuthn API interactions and user authentication logic.

### How It Works

1. **User Registration**: The user registers their device using WebAuthn, which generates a public-private key pair. The public key is sent to the server and stored, while the private key remains securely on the user's device.
2. **User Authentication**: When the user attempts to log in, the server sends a challenge to the user's device. The device signs the challenge with the private key, and the server verifies the signature using the stored public key.

# project Strucutre

```bash
passwordless-webauthn-fido2/
├── client/
│   ├── index.html
│   └── main.js
```


### Running the Project

To run the project, open `index.html` in a web browser. Ensure that the domain is valid and served over HTTPS, as WebAuthn requires a secure context.

```bash
npm start
```
### Technical Flow

1. **Sign Up**: Click the "Sign Up" button first. This action temporarily saves the `rawId` during the runtime.
2. **Initiate WebAuthn**: Fill in your email ID to initiate the WebAuthn call from the browser to the OS (e.g., Mac Touch ID or Chrome). This process creates a key pair where the public key is temporarily stored in `rawId`, and the private key is securely stored in your password manager (Keychain) or Chrome.
3. **Log In**: Click the "Log In" button in the same browser session. The public key is temporarily saved in the same browser session. This step communicates with the browser and the OS (e.g., Mac) to unlock the private key and match it with the temporarily stored `rawId`.

