# Managing VS Code Instances

During class you pretty much *always* want VS Code open with the c:\users\student\class directory loaded as your "home base". This is where you can create (or sync) my notes, etc.

We will have at least two Angular projects you will be working from during the class. 

## `src/applied`

This is the Angular app you will work in for all the labs during this course. 

## `src/final`

This one doesn't exist yet, but it will. This will be a project you will work in for the final lab on Thursday.

## `src/demos`

This one you don't have yet, but can sync from the instructor whenever you like. It's where I'll be doing demos and stuff.

## Super Important 

Save yourself a ton of headaches and frustration. *Always*, when working on an Angular project, open it directly in it's own instance of VS Code. 

You want the `angular.json` and the `package.json` to be in the root of the directory shown in VS Code.

> Note: You do you. I will just tell you that later in the class and you ask me for help and I notice you *don't* have your Angular app running in it's own instance of VSCode
> even if your problem isn't related to that, I will do my best to give you a look that expresses my shame. More disappointed, really.

## Open your applied project

In VS Code, use the "file" menu and select "New Window". This will open another instance of VS Code.

In that *new* instance, use the File menu and select "Open folder". Select the "class" directory in the panel on the left, then in class, `src/applied` and click "Open"

## Install Extensions

In this directory, there is a `.vscode/extensions.json` directory that VS Code reads and will find a list of recommended extensions. It *should* (sometimes doesn't, if not, see below) give you 
a notification in the bottom right corner of VS Code asking if you want to install these extensions. Select "Install"

### If that didn't work

Click the extensions icon on the left of the screen. (the lego brick looking thing). In the search bar at the top, type "@recommended" - install each of the recommended extensions.

## Start the Angular Dev Server

Make sure you are looking at the Explorer view in VS Code (the stack of documents icon at the top on the left). 

At the bottom there will be a node called "NPM Scripts". Expand that and hit the "play" (|>) icon next to "Start".  This will start your development server.

After it compiles the terminal window will display the URL to see your Angular application. If you Ctrl+Click on that url in the terminal, it will open it in the
"integrated browser" in VS Code. 

The integrated browser in VS Code is fairly new. I'm still getting used to it, and usually still prefer to have my Angular app running in a browser most of the time.
You can open Edge in your VM and visit http://localhost:4200 to see your app there.

> A nice feature of the integrated browser is there is a button at the top that will allow you to select an element and add it to your Copilot chat. That way you don't have to say stuff like "Hey, the button looking thing sort of in the middle there? Can we make it bigger?" to an AI that can't see. ;)

## Extra Credit

You will have pretty much always two instances of VS Code running. It can get a little confusing which one is which. What I like to do is use an extension called "Peacock" to make the "home base" 
instance of VSCode more easily identifiable.

In the "home base" instance (the one that has c:\users\student\class open, not the one running your Angular app) install an extension by searching in extensions for "Peacock".

After it installs, enter in the search bar at the top of VS Code `> Peacock` and find "Switch to a favorite color. Try each of them until you find something you will immediately associate with being in "home base".



