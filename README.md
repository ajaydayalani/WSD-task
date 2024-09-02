# Betway Horse Racing Odds Web Scraper

## Overview

This project is a web scraper designed to gather horse racing odds from [Betway.com](http://Betway.com). It provides a REST API that exposes various endpoints for retrieving and managing horse racing data. The API is structured to support user management and to deliver different types of race-related odds.

## Getting Started

Follow these steps to set up and run the project:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ajaydayalani/WSD-task.git
   ```

2. **Install Dependencies**
   Navigate to the root directory of the project and install the required npm packages:
   ```bash
   npm install
   ```

3. **Update Env Variables**
   Create an `.env` file in the root repository and you can then define the PORT (e.g ```PORT=3000```) you want to run the server on `defult port 8080` 

4. **Start the API Server**
   Launch the API server by running:
   ```bash
   npm run start
   ```

5. **Testing the API**
   Use Postman or any other API testing tool to interact with and test the endpoints. The service also comprises of Unit Test using **JEST Framework** to run these test
   ```bash
   npm test
   ```



## API Endpoints

### Users

The authentication service provides the following endpoints:

- **GET /users**
  - Description: Retrieve a list of all users authorized to use the application.
  
- **POST /user**
  - Description: Register a new user to obtain an API key.
  - Parameters: `username` (string) – The username for registration.

### Scraper

The scraper offers several endpoints to fetch race odds data:

- **Past Races**
  - Description: Get results of races that have already occurred.
  - Response Format:
    ```json
    {
      "name": "Tres Chic",
      "position": "1",
      "odds": "10/2"
    }
    ```

- **Upcoming Races**
  - Description: Retrieve a list of horse odds for races scheduled in the near future.
  - Response Format:
    ```json
    {
      "name": "Tres Chic",
      "trainer": "J S Moore",
      "jockey": "Millie Wonnacott",
      "rating": 4,
      "age": 3,
      "weight": 125,
      "odds": "10/2"
    }
    ```

- **Distant Future Races**
  - Description: Get a limited list of horse odds for races scheduled far in advance.
  - Response Format:
    ```json
    {
      "name": "Tres Chic",
      "trainer": null,
      "jockey": null,
      "rating": null,
      "age": null,
      "weight": null,
      "odds": "20/1"
    }
    ```

## Assumptions

This project assumes that the URLs for Betway events are correctly formatted and accessible. Ensure that the URLs you intend to scrape from are available and properly structured to avoid any discrepancies.

---

Feel free to reach out if you have any questions or need further assistance.