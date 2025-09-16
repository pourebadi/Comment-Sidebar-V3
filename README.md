# Modern React Comment Sidebar

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
![Tech Stack](https://img.shields.io/badge/tech-React%20%7C%20TypeScript%20%7C%20Tailwind-blueviolet)

A fully-featured, modern comment and discussion sidebar component built with **React**, **TypeScript**, and **Tailwind CSS**. This project provides a seamless way to integrate interactive, real-time conversations into any web application.

It's designed with a clean, dark-mode-first aesthetic and is fully responsive, customizable, and easy to integrate.

---

## 🚀 Live Demo

**Check out the interactive live demo of the component here:**

[**⬅️ View Live Demo**](https://ai.studio/apps/drive/1szNovNzlGG0huuvuoiqfqax3Sbuow2WO)

---
> **Note:** A live GIF demonstrating the key features would be ideal here. Consider recording interactions like creating a comment, replying, reacting, filtering, and switching themes.
---

## 📋 Table of Contents

- [Features](#-features)
- [Component Philosophy](#-component-philosophy)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [How to Use](#-how-to-use)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **💬 Threaded Replies:** Nested comments for organized discussions and easy-to-follow conversations.
- **⚡️ Scalable Performance:** Efficiently handles long conversations with hundreds of replies by initially loading a subset and allowing users to load more as needed, ensuring the UI remains fast and responsive.
- **📌 Pinned Comments:** Pin a crucial comment to the top of the list, ensuring it remains visible to everyone regardless of sorting or filtering.
- **😍 Emoji Reactions:** Let users react to comments with a set of emojis. Hovering over a reaction shows who reacted.
- **✅ Comment Resolution:** Mark entire comment threads as "resolved" to clean up the workspace while preserving history.
- **🖼️ Image Attachments:** Attach images to comments for clearer visual feedback.
- **👤 User Mentions:** Tag other users with `@` mentions, complete with a smart suggestion popover.
- **🔗 Smart Text Parsing:** Automatically detects and styles hashtags (`#tag`) and URLs.
- **🔃 Advanced Sorting & Filtering:** Sort comments by newest/oldest, and filter conversations by user or resolution status.
- **✏️ Edit & Delete:** Full control for users to edit or delete their own comments, with a confirmation step to prevent accidental deletion.
- **✍️ Edited Indicator:** Displays an `(edited)` label on modified comments for conversational transparency.
- **💾 Auto-Drafts:** Automatically saves your draft as you type. Never lose a long comment by accidentally closing a tab. Works on a per-thread basis.
- **🎯 Boundary-Aware Popovers:** Tooltips and emoji pickers intelligently reposition themselves to never go off-screen.
- **🌗 Light & Dark Modes:** Beautifully designed for both light and dark themes, with auto-detection for system preference.
- **📱 Responsive Design:** A seamless and accessible experience on all screen sizes, from mobile to desktop.
- **🧩 Easy Integration:** Designed as a drop-in component for any React application.
- **📊 State Handling:** Displays `Loading`, `Empty`, and `Error` states to provide appropriate user feedback.
- **🔗 Copy Comment Link:** Easily copy a direct link to a specific comment for sharing.

---

## 🧠 Component Philosophy

- **Self-Contained:** The component manages its own state internally, making it easy to drop into any application with minimal setup. The data is currently mocked but can be easily adapted to fetch from a live API.
- **Performance First:** Features like the "show more" pagination for long threads are prioritized to ensure the UI remains smooth and responsive, even with a high volume of comments.
- **Developer Experience:** Built with TypeScript for type safety and a clean, organized component structure to make it easy to understand, maintain, and extend.

---

## 🎨 Tech Stack

This project is built with modern frontend technologies:

-   [**React**](https://reactjs.org/) - A JavaScript library for building user interfaces.
-   [**TypeScript**](https://www.typescriptlang.org/) - For static typing and a better developer experience.
-   [**Tailwind CSS**](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
-   [**Material Symbols**](https://fonts.google.com/icons) - For clean and modern icons.

---

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps.

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/your-username/react-comment-sidebar.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd react-comment-sidebar
    ```

3.  **Install NPM packages:**
    *(Assuming you have Node.js and npm installed)*
    ```sh
    npm install
    ```

4.  **Run the development server:**
    ```sh
    npm start
    ```
    This will open the project in your browser.

---

## 💻 How to Use

To integrate the comment sidebar into your React application, simply import and render the `Sidebar` component.

Here is a basic example for an application using a standard React build setup:

```jsx
import React from 'react';
import { Sidebar } from './components/Sidebar'; // Adjust the import path as needed
import './your-tailwind-styles.css'; // Ensure Tailwind CSS is set up in your project

function YourApp() {
  return (
    <div style={{ display: 'flex' }}>
      
      {/* Your main application content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1>My Awesome Content</h1>
        <p>This is where the main application content lives.</p>
      </main>

      {/* The Comment Sidebar */}
      <aside style={{ width: '360px', height: '100vh', borderLeft: '1px solid #e2e8f0' }}>
        <Sidebar />
      </aside>

    </div>
  );
}

export default YourApp;
```
> **Note:** For a real-world application, you would modify the component to accept props for the current user and functions to fetch and submit comments to your backend API.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1.  **Fork** the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a **Pull Request**

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
