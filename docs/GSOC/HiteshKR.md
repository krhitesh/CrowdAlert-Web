## CrowdAlert

### Student - Hitesh Kumar Rawat

**Important Links**
* Live demo: [https://crowdalert.herokuapp.com](https://crowdalert.herokuapp.com)
* Project: [https://gitlab.com/aossie/CrowdAlert-Web](https://gitlab.com/aossie/CrowdAlert-Web)
* Organisation: [AOSSIE - Australian Open Source Software Innovation and Education](https://summerofcode.withgoogle.com/organizations/4765796773920768/)

CrowdAlert, designed to be a trustworthy crowdsourced information channel, focuses on delivering the right information to the right people on time. It provides a global platform where users are able to view incidents nearby. Whenever a user reports an incident, CrowdAlert does the heavy lifting of notifying the nearby people.

### Goals

CrowdAlert was conceived and idealized by Bruno Woltzenlogel Paleo in 2017 and was initially developed as a mobile app by Siddartha Sekhar Padhi as a part of GSoC 2017. Then in GSoC 2018, Joydeep Mukherjee extended the idea to develop a full-fledged web app.

This year, the goal was to add core optimisations and new features to the user experience of the React-Django application. That implies, using Server-side Rendering for faster page loading times (significantly low Time To First Byte), using web-sockets for real-time updates for incidents, comments and HTTP Long Polling for upvotes etc., migrating to a better database, finally, decoupling it from Django views. Then write consistent tests to validate different models, APIs, components, reducers and actions. Finally, hosting an NFSW image classifier. Eventually, we will end up with cleaner code, sound application architecture of both frontend and backend, adding more tests and developing/revamping new features are the most obvious ones. This will not only make developing new features much more easier, cleaner and maintainable but will also dramatically improve user experience.
 
### CHANGELOG (August 19, 2019)

The changes can be summarized as follows:
 
1. CrowdAlert-Web now uses Server-side rendering on top of React-Redux web application. The advantages of using Server-side rendering in our case can be summarized as follows:
   * The application’s performance depends on server’s resources and the user’s network speed which makes it very useful for content heavy sites.
   * Most of the search engine crawlers do not yet understand JavaScript. So, it inevitably becomes important to pre-render meta tags before sender the initial HTML to the user. Thanks to Server-side rendering.
2. CrowdAlert-Web’s old database has been migrated to Firebase Firestore opening doors for more powerful queries. A significant time has been spent on designing model classes using the object-oriented approach. This not only resulted in improved performance of geo-spatial queries but also refactor of Django API view classes for the better.
3. CrowdAlert-Web now supports real-time communication for its incidents and comments component. This decreases latencies as compared to HTTP requests and improves user experience.
4. Finalized the continuous integration/continuous deployment process to Heroku.
5. Added frontend (React-Redux) and backend (Django) unit and integration tests which will evaluate the code during CI/CD process.
6. CrowdAlert-Web now has following end user features:
   * Added support for Google Maps direction.
   * User can now edit incidents directly from main incident's page.
   * Added “Settings” page​.
   * New UI for email verification page. New designs for [mobile](https://gitlab.com/aossie/CrowdAlert-Web/uploads/955d115d64408998c636cdc612f09891/Screen_Shot_2019-03-15_at_1.34.23_AM.png) and [web](https://gitlab.com/aossie/CrowdAlert-Web/uploads/5dde16aac7941ee257783c64671287ca/Screen_Shot_2019-03-15_at_1.34.35_AM.png).​
   * Added an option to set the home location.
   * Nearby incidents will now be cached using PouchDB for faster load times.
   * Added location validation while editing an incident.
   * Added “Profile” page for updating name and profile image.
   * CrowdAlert-web now uses a hosted Not Safe for Work (NSFW) image classifier to classify incident images uploaded by the user.
 
### Technical Overview
Front end is written using React/NodeJS and backend using Django. Some of the core technologies/platforms are listed below:
- [Node JS v10.15.1 LTS](https://nodejs.org/ja/blog/release/v10.15.1/) - Basis for development, packaging and deployment tools.
- [React](https://reactjs.org/), [Redux](https://redux.js.org/) - JavaScript framework and state management tool for the frontend
- [Jest](https://jestjs.io/), [Enzyme](https://airbnb.io/enzyme/) - Testing framework for React and Redux
- [Semantic UI React](https://react.semantic-ui.com/) - React based CSS framework
- [Google Firebase Platform](firebase.google.com) - Used for user authentication, database and hosting
- [Django](https://www.djangoproject.com/) - Used for developing ReST APIs and web socket APIs
 
During the first phase of GSoC I implemented server-side rendering. This task was divided into following parts:

- **Initial setup and Routing:** This part included writing webpack configuration for server and client code base, server renderer, implementing React router support.

- **Setting up Redux and server side data fetching:** This part included managing separate store for client and server; Exporting a promise returning function from components mounted on various routes.

- **Setting up proxy and user authentication:** Setting up proxy for the backend server through the render server; Setting up token based user authentication on render server. T
 
- **Finalizing server-side rendering and SEO:** Most of the server-side rendering part has been done. Only remaining part is bug fixing and adding component based dynamic `<meta />` tags. This is handled using React-Helmet.
 
The first phase was entirely focussed on server-side rendering. The deployment part was quite interesting. Since, Heroku limits application purge size to 500MB for a single dyno except when you containerize your application. So, in order to avoid any overhead costs, I used docker to containerize both frontend and backend into same image only exposing frontend's host and port to public.

During the second phase, I implemented web sockets using python’s channels package; Using webSocket connection for signed-in users only for getting events and comments in real-time. For handling messaging queues and groups, I used channel’s in-memory layer instead of redis. For fetching upvote counts incidents and comments, I used HTTP long polling. Then, I spent time designing the Firestore database schemas for every Django app and finally implemented that schema which included refactoring Django views to use new model classes.

During the final phase, I spent time on writing unit test for each and every component, reducer and action. And for the backend, wrote tests for every model, its methods, and views. Then, since I already had raised a merge request for adding continuous integration, I used it to add new test scripts on top.
Then, I spent time on developing new features as described in changes section point 6.


### Merge Requests
 
1. [Merge Request !1](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/59): Initial setup and routing, *Status: **merged***
    * Webpack config
	* Babel config
	* npm scripts
	* New ssr dependencies
	* Added entry point file for server
	* Refactor src/ into client/ and `index.js`
	* Setting up the renderer that binds ES6 stringified HTML with server side JSX and returns it
	* Setting up build configuration for client and server-side bundle.js
	* Implement React Router support and bind with it express Route configuration
	* Restructuring the webpack and npm scripts for cleaner code

2. [Merge Request !2](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/60): Redux and server-side data fetching, *Status: **merged***
	* Create separate stores for the browser and the server
	* Exporting `loadData` function along with the components that returns a promise
	* Creating a `Promise.all` to get notified when all of the data fetching

3. [Merge Request !3](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/61): Proxy and user authentication, *Status: **not merged***
	* Refactor code to redirect all `/api` routes
	* Create server side and client side axios instances with thunk
	* Setup configuration with express to proxy all `/api` routes made on the client side
	* Refactor authentication based rendering in App.js for more generalized `RequireAuth` based components
	* Setting up a context in​ StaticRouter​ to setup not-found route and send a 404 to the browser
	* Replace `window.localStorage` by cookies as required by auth
	* Handing Auth components using **Firebase Auth Rest API** on server

4. [Merge Request !4](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/62): Finalizing Server side rendering and SEO, *Status: **not merged***
	* Handling errors when one or some `loadData` promise(s) rejects
	* React Helmet setup
	* Statically render SEO tags
	* Final cleanup and prepare remote deployment

5. [Merge Request !5](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/63): WebSockets - Setting up In Memory persistence layer and consume web socket connections, *Status: **not merged***
	* Declare a backend channel layer with in-memory persistence specification
	* Writing Events consumer
	* Writing Comments consumer
	* Create routing.py, the file that contains web socket routing information
	* On frontend, setup socket connects in a new directory socket/index.js that takes `store.dispatch`
6. [Merge Request !6](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/64): Long polling, *Status: **not merged***
	* Writing Upvotes long polling consumer
7. [Merge Request !7](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/65): Create model classes and migrate to firestore, *Status: **not merged***
	* Create new models for Firebase Firestore: Comment model, CommentThread model, IncidentReport model, Incident model, User model, Upvotes model, Image model and Classifier model
	* Add data fetching logic encapsulated in those models
	* Cleanup up existing Firebase Database APIs from all of views.py
	* Migrate current Firebase Database APIs in views.py to new Model-based Firestore APIs
8. [Merge Request !8](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/66): Geohash implementation, *Status: **not merged***
	* Port GeoFire functions in python for efficient geohash queries on Firestore
	* Using Haversine formula on significantly less incidents to calculate the distance
9. [Merge Request !9](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/67): Unit & Integration Testing, *Status: **not merged***
	* Testing components (445)
	* Testing actions (102)
	* Testing reducers (70)
	* Testing APIs and Models (57)
10. [Merge Request !10](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/68): CI/CD Pipeline, *Status: **not merged***
	* Add new tests for backend and data models
	* Bug fixing and patching whilst making sure that the pipeline succeeds
11. [Merge Request !11](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/69): Developing new features, *Status: **not merged***
	* Finalizing support for Google Maps direction and add new tests
	* Allow edits from view incidents page
	* Add settings page features
	* New UI for email verification page. New designs for [mobile](https://gitlab.com/aossie/CrowdAlert-Web/uploads/955d115d64408998c636cdc612f09891/Screen_Shot_2019-03-15_at_1.34.23_AM.png) and [web](https://gitlab.com/aossie/CrowdAlert-Web/uploads/5dde16aac7941ee257783c64671287ca/Screen_Shot_2019-03-15_at_1.34.35_AM.png)
	* Support for an option to set the home location
	* Caching nearby events in the browser
	* Location validation while editing an incident
12. [Merge Request !12](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/70): Update Image Metadata & implement NSFW Image classifier, *Status: **not merged***
	* Update put function in Storage class named `put(self, file, token=None, content_type=None)` in the new pyrebase.py
	* Add a `@asyncfunc` decorated method inside Image model that makes a request to the classifier server
	* Update the NSFW status of the respective Image on Firestore
13. [Merge Request !13](https://gitlab.com/aossie/CrowdAlert-Web/merge_requests/71): Writing documentation, bug fixing and describing the future scope of the project, *Status: **not merged***
	* Documentation on how to setup the server side renderer and webpack server locally
	* Bug fixing
	* Describing the existing architecture of SSR so that it is easier to understand how it is implemented under the hood and therefore build new features upon it
	* Documenting Django APIs using Swagger
	* Describing the future prospects of this project
	* New user profile component to edit photo and name
	* Page for list of incidents reported by the user
	* Updated firestore rules

### Potential New Features
Below are some new features that CrowdAlert should have, grouped according to their prospective difficulties:

**Easy:**
* Add support for image upload from the view incidents page
* Remove WSGI dependency from Django backend
* Fallback to HTTP request if WebSocket is disconnected

**Medium:**
* Use Mapbox. Mapbox gives a free tier to work with unlike Google Maps. There are going to be several updates in the application:
	* Map component in the frontend
	* Feed
	* Reverse Geocoding endpoint
	* Events by location endpoint
	
	Use the `react-mapbox-gl` npm package developed by Uber for this purpose. See [this](https://gitlab.com/aossie/CrowdAlert-Web/issues/27) issue.

**Hard:**
* Use tf-serving for spam classifier
* Add a news aggregator to get latest news on reported incidents from various sources and display as a side column in Feed

### Conclusion
In conclusion, I would like to thank Joydeep Mukherjee, Siddartha Padhi, Thuvarakan Tharmarajasingam and Bruno Woltzenlogel Paleo for being so nice and helpful. I have learnt a lot in the past 3 months and it has been a great experience to be a part of this wonderful community.
