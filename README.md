# budtrack
Hosted Url : https://wvkfik.deta.dev
<br>
Docs : https://04jztg.deta.dev

Use
```git clone <url>```
To clone the repository locally.

## Setting up
An example of .env is provided as `.env-sample`
Create a .env file or any other method to store environment variables

## Installation of packages
`requirements.txt` is provided in the files to install the libraries involved.
Use
```pip install -r requirements.txt``` 
To install all the dependencies.

## Starting the Server
Use
```uvicorn main:app --reload``` 
To start the server.

## Docs
Go to the port where server is listening and add `/docs` at the end of url to use Swagger Documentation.

## Hosting
Use Deta to host the server.
Refer to : https://fastapi.tiangolo.com/deployment/deta/
