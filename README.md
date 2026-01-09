# Model Portfolio Template

A premium, easy-to-deploy model portfolio website template built with Next.js and Tailwind CSS.

## Features

- **Centralized Config**: All content is managed via `src/data/model-config.json`.
- **Admin Dashboard**: Local `/admin` interface to easily update text and upload photos without touching code.
- **Dynamic Content**: Pages (Home, Portfolio, Sidebar) automatically update based on the config.
- **Responsive Design**: Premium mobile-first layout with a sticky sidebar on desktop.
- **Image Optimization**: Automatic aspect ratio handling and optimization via Next.js Image.

## How to Duplicate for a New Client

1.  **Clone this repository**:
    ```bash
    git clone <repository-url> new-model-name
    cd new-model-name
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

4.  **Customize Content**:
    -   Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).
    -   Update the Personal Info, Stats, and Upload new images.
    -   Click "Save Changes".
    -   *Note: Using the admin panel locally updates `src/data/model-config.json` directly.*

5.  **Deploy**:
    -   Push your changes to a Git provider (GitHub, GitLab, etc.).
    -   Deploy to Vercel (recommended) or Netlify.
    -   *Important*: The `/admin` route is designed for local setup. Changes made in production (on Vercel) will **conflicted** with the immutable file system of serverless functions and will not persist permanently. **Always configure the content locally using the Admin panel, commit the changes to Git, and then push to deploy.**

## Project Structure

-   `src/data/model-config.json`: The source of truth for all data.
-   `src/components/Sidebar.tsx`: The main navigation and profile component.
-   `src/app/page.tsx`: Home page (Hero).
-   `src/app/portfolio/page.tsx`: Grid gallery with Lightbox.
-   `src/app/admin/page.tsx`: The local content management interface.
