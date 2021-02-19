# Food Delivery

This is a complete full-stack application created to demonstrate my development skills.

The project consists of two main application:

- The backend : Built using Yii2 framework.
- The frontend : Built using ionic 4 framework (Angular)

## Project Requirements


**Write an application for Food Delivery**

- User must be able to create an account and log in. (If a mobile application, this means that more users can use the app from the same phone).
- Implement 2 roles with different permission levels
    * Regular User: Can see all restaurants and place orders from them
    * Restaurant Owner: Can CRUD restaurants and meals
- A Restaurant should have a name and description of the type of food they serve
- A meal should have a name, description, and price
- Orders consist of a list of meals, date, total amount and status
- An Order should be placed for a single Restaurant only, but it can have multiple meals
- Restaurant Owners and Regular Users can change the Order Status respecting below flow and permissions:
    * Placed: Once a Regular user places an Order
    * Canceled: If the Regular User cancel the Order
    * Processing: Once the Restaurant Owner starts to make the meals
    * In Route: Once the meal is finished and Restaurant Owner marks it’s on the way
    * Delivered: Once the Restaurant Owner receives information that the meal was delivered by their staff
    * Received: Once the Regular User receives the meal and marks it as Received
- Status should follow the sequence as stated above, and not allowed to move back
- Status can not be changed by a different user than is stated above
- Orders should have a history about the date and time of the status changing
- Both Regular Users and Restaurant Owners should be able to see a list of the orders
- Restaurant Owners have the ability to block a User

- REST API. Make it possible to perform all user actions via the API, including authentication (If a mobile application and you don’t know how to create your own backend you can use Firebase.com or similar services to create the API).
In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
- If it’s a web application, it must be a single-page application. All actions need to be done client-side using AJAX, refreshing the page is not acceptable. (If a mobile application, disregard this).
- Functional UI/UX design is needed. You are not required to create a unique design, however, do follow best practices to make the project as functional as possible.
- Bonus: unit and e2e tests.

## Installation

**The Backend Project:**

The project is built on top of the [Yii2 Starter Kit](https://github.com/yii2-starter-kit/yii2-starter-kit) .

**In summary:** to deploy the backend project follow these steps:
* clone the project
* create empty MySql database.
* create .env file in the root of the project ( use the default .env.dist file template)
* Update .env values for database variables.
* Update .env values for host Urls.
* install composer
* run this command
```bash
php console/yii app/setup
 ```
 * For System Control-Panel open: [http://YOUR_HOST/backend/web](http://YOUR_HOST/backend/web)
 * For API Documentations (Swagger UI) open: [http://YOUR_HOST/api/web](http://YOUR_HOST/api/web)
 
 
**The Frontend Project:**

The project is built using [Ionic 4 Angular framework](https://ionicframework.com/) .

**In summary:** to deploy the frontend project follow these steps:
* clone the project
* run this command
```bash
npm i
 ```
* update environment.ts file with path to you API end-point.
* Run 
```bash
ionic serve
 ```

and that is it.

## Some Screenshots

* Swagger UI for APIs Documentation:

![screenshot1](/screenshots/api1.png)

![screenshot2](/screenshots/api2.png)

![screenshot3](/screenshots/api3.png)

* Frontend UI screens:

![screenshot4](/screenshots/ui1.png)

![screenshot5](/screenshots/ui2.png)

![screenshot6](/screenshots/ui3.png)

![screenshot7](/screenshots/ui4.png)

![screenshot8](/screenshots/ui5.png)

![screenshot9](/screenshots/ui6.png)
 
 


        
 
