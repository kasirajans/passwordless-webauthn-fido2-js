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
    const data = await navigator.credentials.create({
        publicKey: {
            rp: {
                name: "Example Corp",
            },
            user: {
                id: new Uint8Array(16),
                name: email,
                displayName: email,
            },
            challenge: new Uint8Array(32),
            pubKeyCredParams: [
                { type: "public-key", alg: -7 },  // ES256
                { type: "public-key", alg: -257 } // RS256
            ],
        },
    });
    console.log(data);
    rawId = data.rawId;
    showModalText(`Successfully registered ${email}`);
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
    modal.querySelector("[data-content]").innerText = text;
    modal.showModal();
}
