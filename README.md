# Dynamic Egocentric Exploration

## Self hosting instructions
1. Create an .env file in `/backend/` and `/frontend/`.
2. Write the following environment configuration in these files:


| Config key | Description | Fallback value |
| ------------- | ------------- | ------------- |
| | BACKEND | |
| REQUEST_SECRET | Some string expected from the backend API for extra security. | |
| APP_PORT | HTTP port of the application. | 8000 |
| | FRONTEND | |
| VITE_BACKEND_URL | The host where the backend was deployed and also the subroutes of it. Don't put a slash at the end of the string. Example: `http://localhost:8000/api/v1/web-scraper`| |
| VITE_REQUEST_SECRET | Some string expected from the backend API for extra security. | |

3. `cd` into `/backend/`, run `npm i; npm run start`.
4. If this throws an error, you don't have chromium installed. Puppeteer needs it. Install it and try `npm i` again.
5. `cd` into `/frontend/`, run `npm i; npm run dev`.
6. You should be good now and the project should work. Have fun!