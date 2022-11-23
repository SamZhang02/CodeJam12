# CodeJam21
## The 123LOADBOARD Problem
⚡ Problem

Carriers drive large trucks for several hours straight, and if they are not well rested, they can experience fatigue and sleepiness on the road. Drowsiness while driving is hazardous for carriers and surrounding drivers. Keeping carriers awake and alert could save lives.

🎯 Ideal Goal

Ensure carriers stay awake while driving.
## What it does
We wanted to challenge 123LOADBOARD's ideal goal's reactive nature and propose a preventive solution to the problem instead. 

DrooVE is a smart itiniary planner that suggests a driving itiniary to follow throughout the trip. The web-app takes into account the user's departing position, destination, preferred time of arrival and numbers of hour of sleep in the past 12 hours to determine a itiniary, with specific resting areas that can be stayed during the trip.
## How we built it
Backend: Node.JS with Google Maps API

Frontend: Vanilla JS with TailWindCSS
## Challenges we ran into
CodeJam12 is everybody's first hackathon, so coming up with a proper project outline with clear task delegation was a challenge. 

Additionally, most of the team were familiar with different tech stacks, so having everyone adapt to Node.JS was a challenge as well

Logistically, there was no readily availible APIs that can look for rest areas alongside a route, and our backend team had to combine two of Google Map's API to write our own algorithm that finds said rest areas. 
## What's next for DRooVE
The most important step would be to implement DRooVE as a mobile app, allowing truck drivers to have easy access to the trip planner while on the go. (We lacked the technical knowledge to do so) Additionally, a database implementation in the future can enable users to have their own profiles to make using the planner a more personalized experience (history of past travels, sleeping habits/schedule, etc.). Finally, a rolling algorithm that stores user data and improves with the number of times of usage would be a great tool for truckers as well. 

## Running the Project
Prerequesite: Google Maps API key
1. Clone the repo
2. `npm i`
3. Create a `.env` and create a variable `MAPS_API_KEY`
4. Assign your Google Maps API key to `MAPS_API_KEY`
5. Put your Google Maps API key in the URL in `<script>` section of `plantrip.html`
6. Start the server by `node server.js`
7. Open `login.html` and enjoy.
Note: The login page is hard-coded, any username with `@` included will work
