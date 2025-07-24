

# Dimas & Niken Wedding Invitation

This is a digital wedding invitation app for Dimas & Niken, built with React, TypeScript, and Netlify Functions. The website is designed to be interactive, responsive, and user-friendly for all guests.


## Main Features

- **Cover Screen**: Personalized opening screen with guest name from URL.
- **Countdown**: Countdown timer to the wedding day.
- **Our Story**: The couple's journey and love story.
- **Event Details**: Information about time, location, and agenda.
- **Gallery**: Prewedding and special moment photos.
- **RSVP Confirmation**: Form for guests to confirm attendance, number of guests, and food preferences. Data is sent to Discord via Netlify Function.
- **Guest Book**: Guests can leave messages and wishes.
- **Gift Info & Registry**: Bank account, e-wallet, and gift registry information.
- **Accommodation & Transportation**: Hotel and transport recommendations for out-of-town guests.
- **Health Protocol**: Health protocol information for the event.
- **Scroll to Top Button**: Easy navigation to the top of the page.
- **Modern UI & Animation**: Uses AOS, Bootstrap, and custom CSS.


## Technology Stack

- React & TypeScript
- React Router DOM
- Bootstrap 5 & Bootstrap Icons
- AOS (Animate On Scroll)
- Slick Carousel (for gallery)
- Netlify Functions (RSVP backend to Discord)
- Node-Fetch (Discord integration)


## Folder Structure

- `src/` : All React source code and components
- `public/` : Static files (images, music, video)
- `netlify/functions/` : Serverless backend (send-discord-message.js)
- `build/` : Production output


## How to Run

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development mode:
   ```bash
   npm start
   ```
4. Open in browser: [http://localhost:3000](http://localhost:3000)


## Deployment

Automatic deployment to Netlify. RSVP and Guest Book use Netlify Functions to send data to Discord.


## Environment Configuration

Add a `.env` file in the project root for the Discord webhook:
```
DISCORD_WEBHOOK_URL=your_webhook_url
```




---
This website is made with ❤️ for Dimas & Niken's special moment.

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
