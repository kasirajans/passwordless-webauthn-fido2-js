import { startRegistration } from "@simplewebauthn/browser";
const signupButton = document.querySelector("[data-signup]");
const loginButton = document.querySelector("[data-login]");
const emailInput = document.querySelector("[data-email]");
const modal = document.querySelector("[data-modal]");
const closeButton = document.querySelector("[data-close]");

signupButton.addEventListener("click", signup);
loginButton.addEventListener("click", login);
closeButton.addEventListener("click", () => modal.close());
let rawId;
const SERVER_URL = "http://localhost:3000";

async function signup() {
    const email = emailInput.value;
    try {
        // Get the init challenge from the server
        const response = await fetch(`${SERVER_URL}/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            showModalText(`Failed to register ${email}`);
            return;
        }

        const { options } = await response.json();
        console.log("Registration options:", options);

        // Ensure options contain the required properties
        if (!options || !options.challenge) {
            throw new Error("Invalid registration options received from server");
        }

        // create passkey
        const credential = await startRegistration(options);
        console.log("Credential:", credential);

        // save passkey to server
        const saveResponse = await fetch(`${SERVER_URL}/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                credential,
            }),
        });
        const { success } = await saveResponse.json();
        if (success) {
            showModalText(`Successfully registered ${email}`);
        } else {
            showModalText(`Failed to register ${email}`);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        showModalText(`Error: ${error.message}`);
    }
}

async function login() {
    const email = emailInput.value;
    const data = await navigator.credentials.get({
        publicKey: {
            challenge: new Uint8Array(32),
            allowCredentials: [{
                id: rawId,
                type: "public-key",
            }],
            rpId: "localhost",
        },
    });
    console.log(data);
    showModalText(`Successfully logged in ${email}`);
}

function showModalText(text) {
    modal.querySelector("p").textContent = text;
    modal.showModal();
}