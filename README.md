# team50: TooFull
Responsive web app written in ReactJS, Node with Express, and MongoDB that allows users to create lists of their favorite food based on category(dish, beverage, or ingredient), search for other existing lists to discover new food items, view top three most popular food items sorted by category, update your user profile and add and remove friends.

This project was the final group project of CSC309 at the University of Toronto, programmed by Valerie Wirianto, Lyanna Deng, and Max Jin. Project finished in December 2021.

## URL of deployed app
https://damp-tundra-15138.herokuapp.com/

## Instructions for Regular User
If you wish to log in as a regular user with dummy data, use credentials:
    - username: user
    - password: user

###### Authentication: Signup, login, logout
At the deployed URL, users can click Sign Up if they do not have an account. They must input their desired username and password. Usernames may only consist of letters, numbers, and underscores. Usernames and passwords must be at least 3 characters long. If the username already exists, the user is prompted to choose a different one.

Users can login using their username and password. They will be alerted if their credentials are invalid.

To log out, users click the Logout button located at the top right of the page in the navigation bar.

###### Main Page: View Top 3 Popular Food Items Across All Users' Lists
Upon logging in, users are taken to the main page. On the right is a chart showing the top three most popular food items of that category. For instance, if category is beverages, the chart shows the top three most frequent beverages that appear across all users' lists. You can hover over each bar to see the exact number of times that item has appeared in total across all lists. You can select a different category of viewing the top three items via the drop down menu above the chart.

###### Main Page: Display My Lists and Create New Lists
On the left of the main page are the names of the current user's lists. To create a new list, click on the "Not enough lists? Create a new one!" button. In the popup window, input the listname, choose a category of that list, the permissions, and a list description. If permissions is set to private, only the owner of that list can view it. If the permissions is set to public, anyone can view their list(other users can view their list in the search page, described later). Hit submit and a new list is created. Click on that list to view it. 

###### Individual List Page
Upon clicking on a list, you can see each food item's rank, name, and notes in the table. You can edit each item's name and notes, or delete each item by clicking the Edit and Delete button. To add a new item, click Add a new list item button and input accordingly. To edit the description of the list, click Edit Description. The list's description is located on the right of the page. To delete the entire list, click the Delete the whole list button. 

###### Searching for Lists
In the navigation bar, click on Search for Similar Lists. You can search by two types: list name and food name. If you search by food name, input a food item in the search bar and click search. Lists that contain that food item in them will be found and displayed. If you search by a list name, input the name of one of your lists. Lists that share as many items as possible with your list will be displayed. You can view each list found by clicking on their name under the List Name column. You can also view the profile of the user who owns that list by clicking their username in the Username column.

###### Friends: Adding friends, viewing current friends and friend requests
If you click on Friends in the navigation bar, you can view your current friends, friend requests, and send friend requests. You can delete users you wish to remove from your friends list. you can accept or reject friend requests. You can also send friend requests to other users by entering their username and clicking Send the Request. You can click on each user's username to be taken to their profile.

###### User Profile
When viewing other users' profiles, you of course will not be able to edit their profile information. To visit your profile, click on Profile in the navigation bar. You will see your profile information located in text boxes(Name, age, nationality, favorite food, etc) and you can change each one and click Update if you wish to update your profile information.

Post functionality is unfortunately incomplete due to the time constraints.

## Instructions for Admin
If you wish to log in as an admin, use credentials:
    - username: admin
    - password: admin

###### Update User List: Deleting existing users
In addition to all the functionalities of a regular user, an admin has an additional Update User List button in their navigation bar. They will be taken to a page with all users' usernames and can delete users if their wish. They can also view each user's profile page by clicking on their username.


## Third party libraries
Cite for the package react-html-parser used: 1. React-HTML-parser. npm. (n.d.). Retrieved November 7, 2021, from https://www.npmjs.com/package/react-html-parser.

For individualList.js, a package called react-html-parser is used. Detail about the package can be found at https://www.npmjs.com/package/react-html-parser.

For the Main Page's chart, Chart.JS was used from https://www.npmjs.com/package/chart.js?activeTab=readme.

For the drop down to search for users to send friend requests to in the Friends page, react-selector was used from https://www.npmjs.com/package/react-selector.

## Overview of routes
POST /user/signup
- Adds a new user, return the user if successful
Body:
{
	"usernameInput": String,
	"passwordInput": String
}

POST /users/login
- Logs a user in and creates session. Sends back cookie if successful.
Body:
{
	"usernameInput": String,
	"passwordInput": String
}

GET users/check-session
- Checks if user is logged in with a session on server. Sends back current user id if they are. 

GET /users/logout
- Logs user out. If successful will destroy session

GET /get_all_users
- Get all users in database. Returns all user and their information in alphabetical order upon success

DELETE /delete_user/:id
- Delete a user by that user id. Will also delete lists owned by that user. Returns {message: "Delete a user successfully"} if successful.

POST /create_list
- Creates an empty list belonging to the use who created the list. Returns lists if success. 
Body:
{   
    "listName": String
    "category": String
    "permissions": String
    "listDescription":String
}

POST /edit_description/:id
- Change list description given the list id. Return description if success.
Body:
{
    "listDescription": String
}

GET /get_all_lists
- Gets all lists of that user via the user id stored in the cookie/session. Returns lists with id, and listName fields.

GET /get_a_list/:id
- Get a specific list by its id

POST /add_item/:id
- Add item to a list. List id included in params. Returns the updated list.
Body:
{
	"rank": Number,
    "foodName": String,
    "notes": String
}

GET /get_a_item/:id/:item_id
- Get an item by the list id and item id. :id is list id. :item_id is item id.

DELETE /delete_item/:id/:item_id
- Delete item by list id and item id

POST /modify_item/:id/:itemId
- Change item information given its list id and item id. Return list with that item updated.
Body:
{
    "foodName": String,
	"notes": String
}

DELETE /delete_list/:id
- Delete an entire list by its id. Return {message: "Delete a list successfully"} if successful

POST /create_friendList
- Creates an empty friend list for a user. Returns the friend list.
{
    user_id: ObjectID
}

GET /get_a_friend_by_friendID/:id
- Find a friend list by friendlist id

GET /get_a_friend
- Find a friend list by the owner's id. Returns the list if successful. Uses session to determine owner's id.

POST /add_potential_friend
- Send a friend request to a user. Uses currently logged in user's session. Pass in username in body of friend to send request to.
Body
{
    username: String
}

POST /add_existing_friend
- accept a friend request. Returns the updated friend list for that user. Uses user's session and pass in username of friend to accept.
{
    username: String
}

DELETE /delete_existing_friend
- Remove an existing friend of a user's friend list. 
Return: {
			"existing_friends": existing_friends,
			"potential_friends": potential_friends,
			"existing_friends_id": existing_friends_id,
			"potential_friends_id": potential_friend_id
		}
upon success

DELETE /delete_potential_friend
- Reject a friend request. Removes that user from a user's friend requests sent to them. Uses user's session to keep track of current user, and body username to find user whose friend request to delete. Return that user's friends and request upon success.
Body to send in:
{
    username: String
}

GET /get_lists_food/:food
- Search for lists that contain :food in them Returns list id, owner's username, owner's id, list name of those lists.

GET /get_most_popular/:category
- Get top 3 most popular food items(aka items appearing most frequently across all users' lists) based on category.

GET /get_user_info/:id
- Get user's profile information by :id. Info includes Age, Nationality, favorite Cuisine, favorite food, their name, and short biography/about me.

POST /change_user_info/:id
- change a user's profile information given :id.
Body:
{

	"name": String
	"age": Number
	"nationality": String
	"favouriteFood": String
	"favouriteCuisine": String
	"bio": String
}