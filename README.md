# Video Tutorials

Video Tutorials is a server-side rendered project that utilizes Node and Express hosted on Heroku.  The front end is organized into templates compiled by Handlebars.  The database is provided by MongoDB/Mongoose hosted on Mongo Atlas.

Guests and users may view existing public tutorials on the home page which are represented by Youtube videos.  
Users may register and login, providing full CRUD functionality to their own video tutorial submissions.  
In addition to providing a title, description, and youtube link, a video tutorial may be marked as public so that it can be viewed by other users.
Users may also enroll in a tutorial.  Video tutorials marked 'public' with the highest enrollment are featured first on the home page.



                                                                     |---Create
                    |---Login---|                                    |---Edit
                    |           |                                    |
HOME (guest) -------|           |---HOME (user)----DETAILS (video)---|
                    |                                                |
                    |---Register                                     |---Enroll