Assignment 2 - s4006031-s3928350-a2

GitHub Repository: https://github.com/rmit-fsd-2024-s1/s4006031-s3928350-a2

Getting Started

To get started, follow these steps:

1. Clone the repository:
   git clone https://github.com/rmit-fsd-2024-s1/s4006031-s3928350-a2.git
2. Navigate to the Express folder:
   cd express
3. Install dependencies:
   npm install
4. Start the Express server:
   npm start
5. Open a new terminal window/tab.
6. Navigate to the React folder:
   cd ../react
7. Install dependencies:
   npm install
8. Start the React app:
   npm start

Available Scripts

In the project directory, you can run:

- npm start: Runs the app in the development mode.
- npm test: Launches the test runner in the interactive watch mode.
- npm run build: Builds the app for production to the `build` folder.
- npm run eject: Ejects the app so you have full control over configuration.

Project Overview

When starting up our website, users will arrive at the home page. From there, they can navigate through the website via the navbar at the top, which includes options to explore available products. The "Shop" section generates general items for sale, while the "Sale" section displays special deals for users.

If users wish to make purchases, they must first access the profile logo and sign up for an account under the "Signup" option in the navbar. After registering, they will be directed to the sign-in page to enter their account details (email and password).

Once signed in, users can view their profile and make edits, including updates to their email, health goals, age, height, weight, activity levels, and dietary preferences. They can also begin adding items to their cart by navigating to the "Products" button on the navbar, where they can choose quantities and products before adding them to the cart.

To view their cart, users can click on the cart icon at the top right of the navbar. From there, they can proceed to checkout, enter their credit card details, and proceed with payment. Once the payment is validated, a summary page will appear.

Users can also leave reviews for products using the `ReviewForm` component available on each product page. They can write a review with a maximum of 100 characters, rate the product using a star rating system, and submit their reviews or edit existing ones, enhancing the interactivity and engagement of the platform.

That's about it to our website. I hope you enjoy your experience.

Learn More

You can learn more in the Create React App documentation and React documentation.

Code Splitting, Analyzing the Bundle Size, Making a Progressive Web App, Advanced Configuration, Deployment

These sections have moved to the respective documentation links provided.

npm run build fails to minify

This section has moved to the troubleshooting section of the Create React App documentation.

References

- icon Used:
    - trolley-cart.png: https://www.flaticon.com/free-icon/trolley-cart_9485970?term=cart&page=1&position=65&origin=search&related_id=9485970
    - user.png: https://www.flaticon.com/free-icon/user_8801434?term=profile&page=2&position=68&origin=search&related_id=8801434
    - Soil icon.png: https://www.flaticon.com/free-icon/shop-sign_9293786?term=vegetable+shop&related_id=9293578&origin=search
    - instagram.png: https://www.flaticon.com/free-icon-font/instagram_6422200
    - facebook.png: https://www.flaticon.com/free-icon-font/facebook_6422199
    - twitter.png: https://www.flaticon.com/free-icon-font/twitter_6422210
    - Our Values.jpeg: https://stock.adobe.com/au/images/our-values-text-stamp-concept-background/593596978?asset_id=605159270
    - Happy Eating.jpeg: https://stock.adobe.com/au/images/portrait-of-cute-african-american-girl-eating-food-at-table-and-smiling-happily-while-enjoying-dinner-with-family/422313989?asset_id=422313989
    - Premium Vegetable.jpeg: https://stock.adobe.com/au/images/deluxe-veggie-hotpot-where-premium/778592267?asset_id=778592267

- Styling Resources:
    - Card Component: https://flowbite.com/docs/components/card/
    - Tailwind CSS: https://tailwindcss.com
