A clone of the Hacker News website.

NOTE: I realized too late that the API has its own method for adding and deleting favorites. My method involves using sessionStorage and works for something smaller like this project. I tried to introduce the add/delete favorite from the API, and was successful, but this introduced conflicts with my code and basically made things favorited twice. I tried to correct all of these and refactor some of the code to include the API calls to add and delete favorites, but this complicated things greatly and made it so that the program took a huge amount of CPU usage.

Given that I had already spent about 10 hours on the project, and the project does work and is even responsive (forms and items stack neatly as screen shrinks), I felt like it was not in my best interest to continually plug away at it.

For the record, the API calls that would've been made to add and delete favorites are commented out in the code inside of the User class.
