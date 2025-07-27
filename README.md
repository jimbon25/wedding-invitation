# Wedding Invitation

This is a digital wedding invitation app for Dimas & Niken, built with React, TypeScript, and Netlify Functions. The website is designed to be interactive, responsive, and user-friendly for all guests.
- **Screenshot:**

<p align="center">
<img src="public/images/screenshoot/ss.jpg" width="500" alt="Screenshot 1"/>
</p>


## Table of Contents

- [Main Features](#main-features)
- [Languages & Frameworks](#languages--frameworks)
- [How to Download](#how-to-download)
- [How to Run](#how-to-run)
- [Gemini AI Chat Setup](#gemini-ai-chat-setup)
- [Deployment](#deployment)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [Node.js Version](#nodejs-version)
- [Available Scripts](#available-scripts)
- [Contact Me](#contact-me)
- [License](#license)
- [Acknowledgements](#acknowledgements)


## Main Features

- **Cover Screen**: Personalized opening screen with guest name from URL.
- **Countdown**: Countdown timer to the wedding day.
- **Our Story**: The couple's journey and love story.
- **Event Details**: Information about time, location, and agenda.
- **Gallery**: Prewedding and special moment photos.
- **RSVP Confirmation**: Form for guests to confirm attendance, number of guests, and food preferences. Data is sent to Discord via Netlify Function. **Protected by Google reCAPTCHA to prevent spam bots.**
- **Guest Book**: Guests can leave messages and wishes. **Protected by Google reCAPTCHA to prevent spam bots.**
- **Gift Info & Registry**: Bank account, e-wallet, and gift registry information.
- **Accommodation & Transportation**: Hotel and transport recommendations for out-of-town guests.
- **Scroll to Top Button**: Easy navigation to the top of the page.
- **Modern UI & Animation**: Uses AOS, Bootstrap, and custom CSS.
- **Gemini AI Chat**: Floating Gemini icon with AI chat bubble, allowing guests to ask questions about the wedding invitation and get instant answers powered by Google Gemini AI.


## Languages & Frameworks

- TypeScript
- React
- Node.js (Netlify Functions)
- Bootstrap 5 & Bootstrap Icons
- AOS (Animate On Scroll)
- Slick Carousel (for gallery)


## How to Download


You can download or clone this repository using Git:

**Linux / macOS:**
```bash
git clone https://github.com/jimbon25/wedding-invitation.git
```

**Windows (Command Prompt or PowerShell):**
```powershell
git clone https://github.com/jimbon25/wedding-invitation.git
```

Or, click the green "Code" button on GitHub and choose "Download ZIP" to get the source files directly.


## How to Run

1. Clone this repository ([GitHub Docs: Cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository))
2. Install dependencies ([npm Docs: install command](https://docs.npmjs.com/cli/v10/commands/npm-install)):
   ```bash
   npm install
   ```
3. Start development mode:
   ```bash
   npm start
   ```
4. Open in browser: [http://localhost:3000](http://localhost:3000)




## Gemini AI Chat Setup


To enable the Gemini AI Chat feature ([Google Gemini API Docs](https://ai.google.dev/gemini-api/docs/get-started)):

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. In your Netlify or Vercel dashboard, add a new environment variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** (your Gemini API key)
3. Deploy or redeploy your site so the environment variable is available to the serverless function.
4. The floating Gemini icon and chat bubble will appear automatically, allowing guests to ask questions about the invitation.

> **Note:**
> - Your Gemini API key is kept secure in the backend (serverless function) and never exposed to the browser.
> - The AI will only answer questions about the wedding invitation and will politely decline out-of-context questions.

---

## Deployment


### Netlify
1. Make sure you have a Netlify account ([Netlify Docs: Getting Started](https://docs.netlify.com/get-started/)).
2. Click "New site from Git" and connect to this repository.
3. Set the environment variable `DISCORD_WEBHOOK_URL` in the Netlify dashboard.
4. Build command: `npm run build`, publish directory: `build`.
5. Deploy and your app is ready to use.

### Vercel
1. Make sure you have a Vercel account ([Vercel Docs: Getting Started](https://vercel.com/docs/get-started)) and your repo is pushed to GitHub.
2. Import the project from GitHub to Vercel.
3. Set the environment variable `DISCORD_WEBHOOK_URL` in the Vercel dashboard (Project Settings > Environment Variables).
4. Build command: `npm run build`, output directory: `build`, install command: `npm install`.
5. Make sure the `node-fetch` dependency in package.json is version 2.x (already set if you use this repo).
6. Deploy and your app is ready to use.

> **Note:**
> - The Discord webhook endpoint will automatically adjust (Netlify/Vercel) without any code changes needed.
> - If you get a 500 error on Vercel, make sure the environment variable and dependency are correct.


## Environment Configuration


### Environment Variables


Set the following environment variables in your Netlify ([Netlify Docs: Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)) or Vercel ([Vercel Docs: Environment Variables](https://vercel.com/docs/projects/environment-variables)) dashboard:

```
DISCORD_WEBHOOK_URL=your_webhook_url
GEMINI_API_KEY=your_gemini_api_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

**RECAPTCHA_SECRET_KEY** is obtained from the Google reCAPTCHA dashboard (use the v2 secret key, not the site key!).

**Note:** Never put your secret key in the frontend code.

**Google reCAPTCHA:** [Register and get your keys here](https://www.google.com/recaptcha/admin/create)


## Troubleshooting

- **RSVP/Guest Book not sent to Discord:** ([Netlify Functions Docs](https://docs.netlify.com/functions/overview/))
  - Make sure the `DISCORD_WEBHOOK_URL` environment variable is correct in the Netlify dashboard.
  - Make sure the Discord webhook is still active.
  - Check Netlify Functions logs for detailed errors.
  - If you get a captcha-related error, make sure the `RECAPTCHA_SECRET_KEY` environment variable is correct and the site key in the frontend is from reCAPTCHA v2.

- **Build failed on Netlify:**
  - Make sure all dependencies are installed.
  - Check the Node.js version in Netlify matches the project recommendation.
  - If you get a reCAPTCHA "Invalid key type" error, make sure the site key used is v2 (not v3/invisible).

- **App is not accessible:**
  - Make sure your Netlify domain is active and there are no DNS issues.
  - Check Netlify logs for runtime errors.

- **Images, music, or videos not showing:**
  - Make sure the files exist in the `public/` folder and the paths are correct in your code.


## Node.js Version


Recommended Node.js versions: **16.x**, **18.x**, or **20.x** ([Node.js Downloads](https://nodejs.org/en/download/))

Make sure your local and Netlify environment use one of these versions for best compatibility.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More


You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

---
## Contact Me

- GitHub: [jimbon25](https://github.com/jimbon25)
- Instagram: [@dimasladty](https://instagram.com/dimasladty)
- Facebook: [Dimas LA](https://facebook.com/iv.dimas)


## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Create React App](https://create-react-app.dev/)
- [Bootstrap](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- [Slick Carousel](https://kenwheeler.github.io/slick/)
- [Netlify](https://www.netlify.com/)
- [Discord](https://discord.com/)
