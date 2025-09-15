# Modern React Comment Sidebar

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
![Tech Stack](https://img.shields.io/badge/tech-React%20%7C%20TypeScript%20%7C%20Tailwind-blueviolet)

A fully-featured, modern comment and discussion sidebar component built with **React**, **TypeScript**, and **Tailwind CSS**. This project provides a seamless way to integrate interactive, real-time conversations into any web application.

It's designed with a clean, dark-mode-first aesthetic and is fully responsive, customizable, and easy to integrate.

---

## 🚀 Live Demo

**Check out the live, interactive demo of the component here:**

[**➡️ View Live Demo**](https://ai.studio/apps/drive/1szNovNzlGG0huuvuoiqfqax3Sbuow2WO)

---

*Replace this with a GIF or screenshot of the component in action.*
 

## ✨ Features

- **💬 Threaded Replies:** Nested comments for organized, easy-to-follow discussions.
- **😍 Emoji Reactions:** Let users react to comments with a curated set of emojis.
- **✅ Comment Resolution:** Mark entire threads as "resolved" to clean up the workspace while preserving history.
- **🖼️ Image Attachments:** Attach images to comments for clearer visual feedback.
- **👤 User Mentions:** Tag other users with `@` mentions, including a smart suggestion popover.
- **🔗 Smart Parsing:** Automatically parses and styles hashtags (`#tag`) and URLs.
- **🔃 Sorting & Filtering:** Sort comments by newest/oldest and filter conversations by user or resolution status.
- **✏️ Edit & Delete:** Full control for users to edit or delete their own comments.
- **✍️ Edited Indicator:** Displays an `(edited)` label on modified comments for conversation transparency.
- **💾 Auto-Drafts:** Automatically saves your work in-progress. Never lose a long comment again if you accidentally close the tab.
- **🎯 Boundary-Aware Popovers:** Tooltips and emoji pickers that intelligently reposition themselves to never go off-screen.
- **🌗 Light & Dark Modes:** Beautifully styled for both light and dark themes, with automatic system preference detection.
- **📱 Responsive Design:** A polished and accessible experience on all screen sizes, from mobile to desktop.
- **🧩 Easy Integration:** Designed as a drop-in component for any React application.

## 🛠️ Installation & Setup

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
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

## 💻 Usage

To integrate the comment sidebar into your own React application, simply import and render the `Sidebar` component. It is self-contained and handles its own state.

Here is a basic example:

```jsx
import React from 'react';
import { Sidebar } from './components/Sidebar'; // Adjust the import path as needed
import './your-tailwind-styles.css'; // Make sure Tailwind CSS is set up in your project

function YourApp() {
  return (
    <div style={{ display: 'flex' }}>
      
      {/* Your main application content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1>My Awesome Content</h1>
        <p>This is where the main content of the application goes.</p>
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

## 🎨 Tech Stack

This project is built with a modern frontend stack:

-   [**React**](https://reactjs.org/) - A JavaScript library for building user interfaces.
-   [**TypeScript**](https://www.typescriptlang.org/) - For static typing and a better developer experience.
-   [**Tailwind CSS**](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
-   [**Material Symbols**](https://fonts.google.com/icons) - For clean and modern icons.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1.  **Fork** the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a **Pull Request**

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
