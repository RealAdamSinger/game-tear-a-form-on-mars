## Instructions

##### Run the Application

Run this Application using the `npm start` script as mentioned below.

Once the App launches, you will notice the Application has a slider at the top that modifies an array of randomly generated data on the screen. 
Notice how the moving the slider to the right increases the amount of data presented. 
(You may experience performance issues while dragging the slider too far to the right so do not drag it too quickly)

##### Show Off your Development Skills

Feel free to install any other dependencies you would like to use and to create additional files as you see fit.

You will be working in the folder: `/src/work_in_this_folder`
Please keep all your changes to this folder and do not modify the files outside of this folder.
 
You will want to start with the `/src/work_in_this_folder/root_component.jsx`, this is the file for the component which is currently displaying the data on the screen. 

1. The data being provided to the component currently updates on a random interval, please make the changes required to render no faster than once per second.

2. For each visible Data Point, also display its Min, Max, and Mean over the period that the Application is loaded.

3. Given the large amount of data that can be displayed, create a dashboard that allows the user to navigate the entire length of data (as if the slider is pulled completely to the right). 
Assume the data represents different readings of a machine's health and the user wants to identify readings that may be indicating problems.

###### A Reading's Data Structure 
```Javascript
{
  id: // [int] the unique id of the sensor recording the reading
  name: // [string] the related component of the machine that the reading is from
  idealValue: // [int] the ideal value of the reading
  value: // [int] the actual value of the reading
}
```


##### Show Your Work

Please use the `/src/work_in_this_folder/COMMENTS.md` file to log a brief description/explaination of your approach and any assumptions you made.

## Available Scripts

You’ll need to have Node >= 6 and npm >= 5.2 on your machine. 
In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
