# Binners Project API

The Binners' Project started with an experimental initiative grant from the J.W. McConnell Family Foundation in 2014. It was initiated in Vancouver and Montreal by Ken Lyotier, founder and former Executive Director of United We Can.

Last year, Ken passed on the leadership to Anna Godefroy, who worked with him since the project’s inception. With the launch of three pilot programs in 2015, the Binners’ Project has since evolved into an innovative social and economic initiative dedicated to working with and for binners.

​Today the Binners’ Project features a Core Group of Binners, a Steering Committee, and two full-time staff members. We also regularly provide practicum positions for students.

![Home](http://samuelcastro.me/binners-project.png "Binners Project")

## Getting Start
You first need to install [node.js](http://nodejs.org/) if you do not already have them on your computer. Then follow these instructions:

    1. Fork the main project: https://github.com/VanHack/binners-project-api
    2. Clone your own forked project: git clone https://github.com/[YOUR-USERNAME]/binners-project-api

## Run

    1. Move into the project directory `$ cd binners-project-api`
    2. Run `$ npm install`
    3. Set your environment: export NODE_ENV=development (OSX/Linux)
    4. Run `$ npm start` (OSX/Linux) and `$npm run start_windows` on (Windows)
    6. Connect to the server using `http://localhost:3000`

## Examples
This section will show you some example of endpoint calls

    http://localhost:3000/api/v1.0/users

## Any problems?
Let us know at samuelcastrosilva@gmail.com


##Heroku Deploy
  git add.
  git commit -m "??"
  git push heroku develop:master
  heroku logs