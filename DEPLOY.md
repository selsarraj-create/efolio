# Deployment Instructions

1.  **Open your terminal** (PowerShell or Command Prompt).
2.  Navigate to the project folder:
    ```bash
    cd D:\model-portfolio-template
    ```
3.  **Login to Vercel**:
    ```bash
    npx vercel login
    ```
4.  **Deploy**:
    ```bash
    npx vercel deploy --prod
    ```

## Enabling Online Updates (Persistence)

To allow the admin panel to work online, you must enable storage on Vercel:

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Select the `model-portfolio-template` project.
3.  Click on the **Storage** tab.
4.  **Create KV Database**:
    -   Click "Create Database" -> Select **KV**.
    -   Name it `model-config-kv`.
    -   Region: Auto (or same as your function).
    -   Click "Create" -> "Connect".
5.  **Create Blob Store**:
    -   Go back to Storage.
    -   Click "Create Database" -> Select **Blob**.
    -   Name it `model-images-blob`.
    -   Click "Create" -> "Connect".
6.  **Redeploy**:
    -   Once connected, go to the **Deployments** tab.
    -   Click the three dots on the latest deployment -> **Redeploy**.
    -   *This ensures the new environment variables are loaded.*

Now, any changes made on the live `/admin` page will be saved to the cloud!
