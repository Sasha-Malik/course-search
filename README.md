# Project 2 : Course Search

Link : https://course-search.glitch.me/ 

## Description
Course search is a real time web application that helps users pick the best courses suited for them. It does so by visualizing the courses based on diferent criteria such as workload, difficulty of exams, grading, content and professor reviews. Users can also post their own text reviews/ post queries as well as submit polls to alter the graphical visualizations.

<br />
<img width="1435" alt="Screen Shot 2022-11-13 at 8 58 20 PM" src="https://user-images.githubusercontent.com/106297572/201534104-6ddaf3e2-2cb9-435c-9868-13917239e60c.png">


## Design 
Our color palattes is composed of shades of purple which matches with the theme of NYU Abu
Dhabi. We seek to create a modern minimalistic design that eases the user to navigate and
explore the website

<br />
<img width="1440" alt="Screen Shot 2022-11-13 at 9 01 58 PM" src="https://user-images.githubusercontent.com/106297572/201534233-e08ddb3a-4681-4c82-965b-7ab3a3863fc6.png">


## User Interaction

Users can rate the course based on difficulty, workload, exams, grading and the professor by submitting a poll. 
Poll Slider is a tool that allows the user to vote on different aspects of the courseb by moving the slider to vote with more precision. This vote gets reflected on the bar graph in real time.

<br />
<img width="1426" alt="Screen Shot 2022-11-13 at 9 04 48 PM" src="https://user-images.githubusercontent.com/106297572/201534463-a046ec21-0ee5-409b-8d1b-1af539492d10.png">

They can see the graphical visualization get altered as soon as the poll is submitted with the updated number of students who submitted the poll.

<br />
<img width="1440" alt="Screen Shot 2022-11-13 at 9 05 00 PM" src="https://user-images.githubusercontent.com/106297572/201534567-ef202091-08d1-4a95-9a5c-badccad25894.png">

Along with this users can also leave an anonymous text review of thier experience with the course / post their queries.

<br />
<img width="1440" alt="Screen Shot 2022-11-13 at 9 06 14 PM" src="https://user-images.githubusercontent.com/106297572/201534574-9db6c732-d0c7-4a97-8e06-a6c723b5991b.png">


## Tools and Technologies
1. HTML,CSS and JS for front-end development
1. NodeJS to create our server and glitch to host our server.
2. Chart.js to draw charts and bar graph in our application.
3. Socket.io for real time data exchange between server and clients.
4. Nedb database to store and retrieve our data.

Socket.io was used so that the comments are displayed in real time, making it streamlined for other users to reply to queries by other users. Meanwhile, get requests are used to fetch the data from the Nedb database when a user initially connects. 


## Idea and Motivation 
1. Tired of scrolling through facebook groups to find reviews for specific courses.
2. Needed a way to visualize course statistics for streamlined decision making.
3. Anynomous comments/reviews so that the users can openly share thier views about the courses/professors.

## Key Challenges

1. Working with a single page web application, this made it harder as the previous button on the browser would not return the user to the home page instead it would take them outside the application. 
2. There was an issue while setting up multiple pages, when a user goes to a different page their socket connection disconnects and they were just able to reconnect under a different connection.
3. When the users are allowed to add courses, the user can add anything as a course even if it isn't one. This was done so that the admin does not have to keep checking if new courses have opened.

## Next Steps

1. Placing majors as cards on the first page and then getting the courses of that major by clicking on that card.
2. Setting up a filter search for courses.
3. Sometimes there is confusion regarding which professor the users are talking about, each user will have an option to enter the name of the professor and their comment will display that name for other users to identify it.
4. A verification process for logging in.


## Avinash

My role was to integrate chart.js with socket.io and the server connection sasha made.I used chart.js bar graph to visualize the workload,grading ,content ,professor and exams section.So , whenever there is a client connection , it retreives the data from the database and display in the bar graph.I also worked on the voting functionality where the user can slide to vote depending on how they felt about the class. I also worked on the confetti effect.I also designed the pop up for thank you section using html and CSS.I learned alot about chart.js and how to configure them with canvas.Chart.js is a very modular framework where you can populate it with any type of data and it will visualize those data.I also implemented different database for the poll votes.The reason for different database was that people might not want to do both vote and comment sometime.So it was modular to have different database for different types of data.So when a client connects, it retreives all the value related to the course and no of users.Then it simply average the data from that course data and display it on the chart.We are still working on how exaclty to convey these visualization effectively.

## Sasha

One of my roles was creating the layout of the entire web application. Using javaScript I made the courses appear in a container as cards, so clicking one of the cards hides the container of the cards and displays the poll container and the container to add comments. I made it so that upon reloading or by clicking the website logo, the home page with the card container shows up. I also set up the Nedb database and created the search bar that enables the user to search the required courses by fetching from the database. I also implemented the get requests that allows the user to see all the comments of a course when the user opens a course. I set up the socket.io framework to make the comment section work in real time. So, multiple get requests are not required when the user adds a comment and other users can reply in real time. I made the comment section where users can post their reviews. Added multiple effects like hover. After that I styled the entire web application using css to fit the theme of the university. Styling the web application to make it look minimalistic and clean for a streamlined experience was one of the tougher parts. 
.
