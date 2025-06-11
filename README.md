# TestMate AI

A modern, responsive chatbot UI built with **React** and **Tailwind CSS** that communicates with a backend via REST APIs. It features a toggleable chat history sidebar, a mobile-optimized navigation layout, and smooth chat interaction.

---
### Demo: 

testmate-ai.vercel.app

---

## 📱 Features

- 🔥 **Responsive UI** with mobile-first design
- 💬 **Chat Interface** for prompt-response communication
- 📜 **Chat History Sidebar**, toggleable on mobile
- 🎛️ **Custom Navigation Bar**:
  - Left: Sidebar toggle (mobile only)
  - Center: App logo
  - Right: Hamburger menu with dropdown links
- 🎨 **Glassmorphism** effects using `backdrop-blur`, opacity, and shadows
- 🧠 Automatically fetches and displays chat history
- ✍️ Send messages via button or Enter key
- 🧩 Modular and scalable React hooks-based structure

---

## 🧪 Tech Stack

| Layer         | Tech               |
|---------------|--------------------|
| Frontend      | React (w/ Hooks)   |
| Styling       | Tailwind CSS       |
| HTTP Client   | Axios              |
| State         | useState, useEffect, useRef |
| Auth Handling | JWT via `localStorage` |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/qa-chatbot-ui.git
cd qa-chatbot-ui
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create Environment File

Create a `.env` file in the root:

```env
REACT_APP_API_BASE_URL=https://your-api-endpoint.com
```

### 4. Start the App

```bash
npm start
# or
yarn start
```

This will launch the app at `http://localhost:3000`.

---

## 🧰 Project Structure

```
src/
├── Chat.js           # Main Chat component
├── App.js            # App entry point
└── index.js          # React DOM root
```

---

## 📦 Component Overview

### `Chat.js`

Handles the full chat interface:

* **State**:

  * `messages`: Stores chat history
  * `input`: Current user input
  * `showSidebar`: Sidebar visibility (mobile)
  * `showMobileMenu`: Right-side menu visibility
* **Lifecycle**:

  * Fetches history on load
  * Scrolls to latest message when updated
* **Methods**:

  * `sendMessage()`: Sends user input to API and updates messages
  * `handleKeyPress()`: Listens for Enter key
* **Rendering**:

  * **Sidebar**: History list with prompt-response summary
  * **Main Area**: Chat bubbles and input box
  * **Header/Nav**: Sidebar toggle + center logo + mobile hamburger menu

---

## 🧑‍🎨 UX & Design

* **Mobile Sidebar Overlay**: Full-screen black overlay with z-index when chat history is shown
* **Navbar**:

  * Left: Sidebar button on mobile
  * Center: "QA ChatBot"
  * Right: Hamburger icon to open dropdown
* **Glassmorphism**: Achieved with Tailwind classes like `backdrop-blur-md`, `bg-opacity-10`, and subtle `shadow-md`
* **Message Styling**:

  * User: Blue bubble aligned right
  * Bot: Transparent white bubble aligned left

---

## 🛡️ Auth

* Requires a valid JWT in `localStorage` under the key `token`
* Included in `Authorization: Bearer ...` header for both GET and POST requests

---

## 🧠 Chat API Expectations

### GET `/chat/history`

Returns:

```json
{
  "history": [
    {
      "prompt": "How to write test cases?",
      "response": "Here’s how you start writing test cases..."
    }
  ]
}
```

### POST `/chat`

Request:

```json
{
  "message": "Your input prompt here"
}
```

Response:

```json
{
  "reply": "API response from the bot"
}
```

---

## 🧩 Accessibility

* Keyboard-friendly input
* Semantic tags and button roles
* `aria-labels` recommended for improved screen reader support

---

## 🛠 Future Improvements

* Add dark/light theme toggle
* Animate sidebar transitions
* Persist chat history by user ID
* Add loading spinners for API calls
* Make menu items dynamic from config or API

---

## 📸 Preview

> Desktop and Mobile views with sidebar overlays and dropdown menus.

| View           | Screenshot                                                    |
| -------------- | ------------------------------------------------------------- |
| Desktop Chat   | ![chat-desktop](./screenshots/chat-desktop.png)               |
| Mobile Sidebar | ![chat-mobile-sidebar](./screenshots/chat-mobile-sidebar.png) |
| Mobile Menu    | ![chat-mobile-menu](./screenshots/chat-mobile-menu.png)       |

---

## 🧾 License

MIT © \ Roopesh

---

## 🙋‍♂️ Questions?

If you need help integrating with a specific API or customizing behavior, feel free to reach out or open an issue. Dummy push


