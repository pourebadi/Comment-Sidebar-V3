# Modern React Comment Sidebar

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
![Tech Stack](https://img.shields.io/badge/tech-React%20%7C%20TypeScript%20%7C%20Tailwind-blueviolet)

A fully-featured, modern comment and discussion sidebar component built with **React**, **TypeScript**, and **Tailwind CSS**. This project provides a seamless way to integrate interactive, real-time conversations into any web application.

It's designed with a clean, dark-mode-first aesthetic and is fully responsive, customizable, and easy to integrate.

---

## 🚀 Live Demo

**View an interactive, live demo of this component here:**

[**⬅️ View Live Demo**](https://ai.studio/apps/drive/1szNovNzlGG0huuvuoiqfqax3Sbuow2WO)

---
> **Note:** A live GIF showcasing key features would be ideal here. Consider recording interactions like creating comments, replying, reacting, filtering, and theme switching.
---

## 📋 Table of Contents

- [Features](#-features)
- [Use Cases](#-use-cases)
- [Component Philosophy](#-component-philosophy)
- [Architecture & State Management](#-architecture--state-management)
- [Tech Stack](#-tech-stack)
- [Component API (Props)](#-component-api-props)
- [Getting Started](#-getting-started)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **💬 Threaded Replies:** Nested comments for organized discussions and easy-to-follow conversations.
- **⚡️ Scalable Performance:** Efficiently handles long threads with hundreds of replies. By initially loading a subset of replies and providing a "Show More" button, the UI remains fast and responsive.
- **📌 Pinned Comments:** Pin an important comment to the top of the list, making it visible to everyone regardless of filters.
- **😍 Emoji Reactions:** Allow users to react to comments with emojis. Hover over any reaction to see a list of users.
- **✅ Resolvable Comments:** Mark entire comment threads as "resolved" to clean up the workspace while preserving history.
- **🖼️ Image Attachments:** Attach images to comments for clearer visual feedback.
- **👤 User Mentions:** Tag other users with `@`, complete with a smart suggestion popover.
- **🔗 Smart Text Parsing:** Automatically detects and styles hashtags (`#tag`) and URLs.
- **🔃 Advanced Sorting & Filtering:** Sort comments by newest/oldest and filter by user or resolution status.
- **✏️ Edit & Delete:** Full control for users to edit or delete their comments, with a confirmation step to prevent accidental deletion.
- **✍️ Edited Indicator:** Displays an `(edited)` label on modified comments for conversational transparency.
- **💾 Auto-Save Drafts:** Automatically saves your draft as you type. Never lose a long comment by accidentally closing a tab. This feature works on a per-thread basis.
- **🎯 Boundary-Aware Popovers:** Tooltips and emoji pickers intelligently reposition themselves to never go off-screen.
- **🌗 Light & Dark Modes:** Beautifully designed for both light and dark themes, with auto-detection of system preference.
- **📱 Responsive Design:** A seamless and accessible experience across all screen sizes, from mobile to desktop.
- **🧩 Easy Integration:** Designed as a drop-in component for any React application.
- **📊 State Handling:** Gracefully handles `loading`, `empty`, and `error` states to provide appropriate user feedback.
- **🔗 Copy Comment Link:** Easily copy a direct link to a specific comment for sharing.

---

## 🎯 Use Cases

This component is ideal for applications where collaboration and feedback are key:

-   **Collaborative Design Tools:** like Figma, InVision, or Miro.
-   **Project Management Dashboards:** like Jira, Asana, or Trello.
-   **Document Editing Platforms:** like Google Docs or Notion.
-   **Content Management Systems (CMS):** for internal feedback on content.
-   **E-Learning Platforms:** for discussions between students and instructors.

---

## 🧠 Component Philosophy

- **Self-Contained:** The component manages its own state internally, making it easy to drop into any application with minimal setup. Data is currently mocked but can be easily adapted to fetch from a live API.
- **Performance First:** Features like "show more" pagination for long threads are prioritized to ensure the UI remains smooth and responsive, even with a high volume of comments.
- **Developer Experience:** Built with TypeScript for type safety and a clean, organized component structure to make it easy to understand, maintain, and extend.

---

## 🏗️ Architecture & State Management

- **Component Structure:** The project is broken down into logical components:
    - `Sidebar.tsx`: The main container component that holds the core logic, data fetching, and state management for filters.
    - `Comment.tsx`: Responsible for displaying a single comment and all its related interactions (editing, reactions, etc.).
    - `CommentInput.tsx`: The input form for adding new comments and replies, including logic for mentions and attachments.
- **State Management:** State is managed locally using React hooks (`useState`, `useMemo`, `useCallback`). This approach removes external dependencies and simplifies integration.
- **Data Flow:** Data (comments) flows down from the main `Sidebar` component to child components via `props`. Events (like adding a comment) are sent upwards using callback functions.

---

## 🎨 Tech Stack

This project is built with a modern frontend stack:

-   [**React**](https://reactjs.org/) - A JavaScript library for building user interfaces.
-   [**TypeScript**](https://www.typescriptlang.org/) - For static typing and a better developer experience.
-   [**Tailwind CSS**](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
-   [**Material Symbols**](https://fonts.google.com/icons) - For clean and modern icons.

---

## 🧩 Component API (Props)

To use the `Sidebar` component in a real-world application, you would pass the following props to connect it to your application's data and logic. (Note: the current implementation uses mocked data.)

| Prop              | Type                                                    | Default       | Description                                                                                                  |
| ----------------- | ------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------- |
| `comments`        | `CommentType[]`                                         | `[]`          | An array of all comment objects to be displayed.                                                          |
| `currentUser`     | `User`                                                  | `null`        | The currently logged-in user object to distinguish their comments.                                        |
| `isLoading`       | `boolean`                                               | `false`       | If `true`, displays the loading skeleton state.                                                           |
| `error`           | `string \| null`                                        | `null`        | If present, displays the error message state.                                                             |
| `onAddComment`    | `(text: string, parentId?: number) => void`             | `undefined`   | Callback function triggered when a new comment is submitted.                                              |
| `onUpdateComment` | `(id: number, text: string) => void`                    | `undefined`   | Callback function triggered when an edited comment is saved.                                              |
| `onDeleteComment` | `(id: number) => void`                                  | `undefined`   | Callback function triggered when a comment is deleted.                                                    |
| `onToggleReaction`| `(id: number, emoji: string) => void`                   | `undefined`   | Callback function triggered when an emoji reaction is added or removed.                                   |

---

## 🛠️ Getting Started

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

---

## 🗺️ Future Roadmap

We have big plans to enhance and expand this component. Some planned features include:

-   [ ] **Live Updates:** Integrate with WebSockets to show new comments and reactions in real-time.
-   [ ] **Markdown Support:** Allow users to use Markdown for text formatting.
-   [ ] **More File Attachments:** Support for attaching other file types (PDFs, documents, etc.).
-   [ ] **Accessibility (a11y) Enhancements:** Ensure full keyboard navigation and screen reader compatibility.
-   [ ] **Internationalization (i18n):** Add support for multiple languages.
-   [ ] **Testing:** Write unit and integration tests to ensure code stability.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1.  **Fork** the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
