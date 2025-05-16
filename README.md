# How to run this project
## Prerequisites
- Node.js
- pnpm

## Getting Started
1. Clone the repository
   ```bash
   git clone ${REPO_URL}
   cd ${REPO_NAME}
   ```
2. Install dependencies
   ```bash
   pnpm install
   ```
3. Start the development server
   ```bash
   pnpm dev
   ```
4. Open your browser and navigate to `http://localhost:5173/`
5. You can also run the following command to start the server and open the browser automatically
   ```bash
   pnpm start
   ```
6. To build the project for production, run
   ```bash
   pnpm build
   ```
7. To preview the production build locally, run
   ```bash
   pnpm preview
   ```
   Navigate to `http://localhost:4173/` in your browser.

   
## Project Structure
```bash
├── src
│   ├── _mock_       
│   ├── app          
│   ├── components   
│   ├── features   
│   ├── hooks        
│   ├── lib
│   ├── utils
```
