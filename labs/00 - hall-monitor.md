# Hall Monitor and Classroom Sync

There are two tools I've created that will help make remote training much smoother for you (I hope!). The first is "hall-monitor", which is an 
Angular app running inside a framework called Tauri that makes Angular the UI layer for a desktop application. Hall-Monitor will allow me (the instructor)
to share links, code snippets, and these labs with you. It will also allow you to ask questions, or flag that you need some help. 

On the server-side, Hall-Monitor talks to a .NET API that I've created using both HTTP requests and web sockets. It uses the same authentication you use to get into the course materials and this virtual machine.

The other tool is Classroom-Sync. This is a VS Code extension that you configure on your virtual machine to talk to a tiny web server running on my
instructor machine. That web server will list the files in my ~/class directory, and allow you to pull files from my machine to yours, compare files that
are on your machine with mine, and even browse the files in my repository.

## Using Hall Monitor

Hall-Monitor is set to automatically start when you sign into your VM. If you ever need to restart it, there is an icon on the desktop of your VM
as well as on the task bar at the bottom (looks sort of like a colorful broken slightly askew figure eight). 

When you start it there is a greeting message glowing with magical possibility reminding you that indeed *anything is possible*. (I just thought a "Login" button was sort of boring).
Click that "Anything is possible" button. Enter the credentials you use to log into https://class.hypetheory-labs.com.

## Hall Monitor - The Feed

The feed is the first tab, and it's read-only for you. I can put links here I want to share with you, and code snippets that might be helpful in class.

## Hall Monitor - Labs

When we hav a labs, I will post it and it will be available for you here. You follow the instructions in the lab, and after each part of the lab, you indicate that you have completed
that section of the lab. This isn't like a legal thing or anything - it just gives me a way to see roughly where everyone is at in the lab. You can also hit a button at the 
bottom of each section in a lab to request help. I will get a notification that you are stuck and if I'm not already helping someone else, I'll send you a message in teams and see if I can help.

The labs will stay here as they are added during the class so you can always go back to a previous one later if you like. In the section below on
Classroom-Sync, I'll show you how you can get your very own copy of a lab to take with you and love forever.

## Hall Monitor - Parking Lot

My personal preference is when you have a question or need some help, you ask me right away. Really. Unmute your microphone and interrupt me.  

However, if questions come up during the class that don't need to be answered right away put them in the parking log. You can ask a question 
without sharing your name with the class if you like, and you can even do a sort of "high priority" message that says you are blocked on
something. You can clear out your asked questions, but not other people's. (I have the ability to remove any questions, but I won't do that unless for 
whatever reason the person that added them is unable to, like you had to leave the class or something. You are encouraged to leave the question until
you feel like you've gotten your answer. Removing the question during my answer will be taken as "ok, Jeff. You can shut up already, I got it! But there
is no guarantee I will actually shut up. Sorry).

## Hall Monitor - What about Teams?

You can still use Teams for chat during the class. Gifs and funny stuff are welcome there. The problem is I don't always notice questions posted there before
they scroll off the top of the screen. Using the parking lot here (or just unmuting!) is much more helpful for me in noticing your questions and requests for help.


## Hall Monitor - Instructor Stuff

As the instructor, I have a view that allows me to see if you are present or not. "Present" here just means that you are logged into your virtual machine
and are logged into the hall-monitor app. This app has no affordances that allow me to poke around in your VM or anything creepy like that.

If you have any questions about the hall monitor tool, you can indicate with the lab affordance for asking for help, or put something in the parking lot!

## Classroom Sync

This VS Code extension needs a tiny bit of one-time configuration. 

Open VS Code (if it isn't already open) and hit the Ctrl+, (control and comma) keyboard shortcut. This will open your settings for VS Code.

> Note: When the class starts, VS Code is configured to open your C:\Users\Student\Class directory. This is the directory that will hold all of our 
> class materials. As you will see you will sometimes have multiple instances of VS Code open during this course. Consider this "class" directory to be yuor "home base". When using Classroom Sync, you should always be using it in an instance of 
> VSCode that has just this directory open.

Ok, in the settings window, look for extensions on the left side tree-view control and under extensions (bottom option, probably), find 
"Classroom Sync". The only setting you need to configure is the Instructor Host. Use this value:

172.18.0.11

After that, you can close the settings window (it auto-saves).

## View a diff of a file

In the explorer view in VS Code, right click on the "README.md" file and select "Compare with Instructor". A diff will be displayed showing you the differences between your version of the README.md and mine.

This can be helpful if you just want to check out what you might be missing if I went too fast, you got distracted, etc.

## Syncing a file 

If you right-click on that README.md (or any file), you can also select "Sync from instructor". This will pull down the instructor version of the file and overwrite yours. 
This is helpful - but be careful. Right clicking on a directory will overwrite everything in your directory with what is in mine. You might lose something important.

(I recommend creating a commit before syncing so you can reset - we'll do a git lab later.)

## Syncing a non-existent file or folder

There are two ways to sync a file or folder you don't have. The first is to just create it as blank (or empty for a directory) on your machine with the same name (case sensitive) as the one
on the instructor's machine, and then just right-click, sync from instructor.

Let's try that one now. In VSCode, create a new folder called "labs" (lower case). Right click on it and sync it. You should now have a copy of this very lab as a markdown file in your labs directory.

The other way is in VS Code, hit Ctrl+Shift+P (or simply type in the quick search bar in the title bar of VSCode). Make sure there is a ">" at the beginning of your search. 
That's telling VSCode you aren't looking for files, but want to run a command. Starting typing "classroom..." until you can see the option to browse the
instructor's files. When you select that, you will be given a list of all the files in my instructor directory. You can toggle each file and folder with the checkbox indicating that you would like to get a fresh copy of each of your selections.

Select the folder "instructor-notes" an any files in that directory. You will have my notes now!


