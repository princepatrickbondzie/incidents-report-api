# Incident Report API

This is a simple API that receives incident reports, adds weather data and stores them in a PostgreSQL database. It also has endpoints to list and filter the stored incident reports.

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Set environment variables:
   - `PORT`: Port to run the server on. Default is 3000.
   - `DB_HOST`: PostgreSQL host.
   - `DB_PORT`: PostgreSQL port.
   - `DB_DATABASE`: PostgreSQL database name.
   - `DB_USERNAME`: PostgreSQL username.
   - `DB_PASSWORD`: PostgreSQL password.
   - `OPENWEATHER_API_KEY`: OpenWeather API key.
4. Run the migrations with `npm run db:migrate`
5. Start the server with `npm start`

## Endpoints

### POST /incidents

This endpoint receives an incident report, adds weather data and stores it in the database.

#### Request Body

{
"client_id": number,
"incident_desc": string,
"city": string,
"country": string
}

#### Response Body

{
"id": number,
"client_id": number,
"incident_desc": string,
"city": string,
"country": string,
"date": string,
"weather_report": {
"description": string,
"temperature": number,
"humidity": number
}
}

### GET /incidents

This endpoint lists all the incidents. It has the following query parameters to filter the data:

- `city`: Filter by city name.
- `min_temperature`: Filter by minimum temperature.
- `max_temperature`: Filter by maximum temperature.
- `min_humidity`: Filter by minimum humidity.
- `max_humidity`: Filter by maximum humidity.

#### Response Body

[
{
"id": number,
"client_id": number,
"incident_desc": string,
"city": string,
"country": string,
"date": string,
"weather_report": {
"description": string,
"temperature": number,
"humidity": number
}
},
...
]

### POST /incidents/search

This endpoint searches for incidents based on country name.

#### Request Body

{
"country": string
}

#### Response Body

[
{
"id": number,
"client_id": number,
"incident_desc": string,
"city": string,
"country": string,
"date": string,
"weather_report": {
"description": string,
"temperature": number,
"humidity": number
}
},
...
]

## Testing

Run the tests with `npm test`. This command runs both unit and integration tests.

Unit tests are located in the `test` directory, and integration tests are located in the `test/integration` directory.

## Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- Mocha
- Chai
