<div align="center">
    <h1><a href="https://github.com/Atheos/Plugin-Template">Atheos Plugin Template</a></h1>
</div>

## About
This is a base for building plugins for Atheos IDE.

There are 4 required files:
* `init.js`: which initializes your plugin into the client-side system
* `plugin.json`: which is what Atheos uses to identify your plugin
* `README.md`: which should contain information for the end-user
* `LICENSE.md`: which should contain information for the end-user

There are 4 common optional files:
* `class.name.php`: contains the class/main engine of your plugin's actions on the server
* `controller.php`: handles/processes/verifies the input data and initializes/manages the class
* `dialong.php`: processes requests and displays html back to the user
* `screen.css`: add custom css styling to the Atheos IDE


You can add files, images, other libraries, etc. as needed for the plugin to operate successfully.

Since you have access to the global `atheos` object you can also utilize other components in the system to modify the editor, work with projects, run searches, etc.

Atheos makes use of several css variables to allow your plugin to seamlessly mech with any users preferred theme. Atheos also has the full Font-Awesome at it's disposal for your iconography.

## Explanation of `plugin.json`

The `plugin.json` file describes how the plugin will interact with Codiad. Most of the properties are self explanatory, however:
 - `rightbar` is an array of objects used if you want custom plugin actions to appear in the right-hand bar. The `action` parameter should call a method in the init.js file.

 - `contextmenu` is similar format to `rightbar` but gives the ability to add context menu items to the file manager. The `applies-to` property specifies whether the menu entry will appear for `directory`(s) `file`(s) or `both`.