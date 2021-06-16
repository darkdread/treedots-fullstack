# Implementation:

### Q) What libraries did you add to the frontend? What are they used for?
google.maps: Used to locate addresses and translate them to lat/lng for markers.

### Q) What's the command to start the application locally?
quasar dev
npx quasar dev

(Default) `npm start`

---

# General:

### Q) If you had more time, what further improvements or new features would you add?
The ability to add/remove hubs, periodic tracking of device location, robust error checking.

### Q) Which parts are you most proud of? And why?
Integrating google maps. It was frustrating trying to implement google maps onto vue because I had no idea how vue handles its lifecycle, and how to interact with other components.

### Q) Which parts did you spend the most time with? What did you find most difficult?
Integration of google maps. I had no idea how to access another component's data, and not to mention the data also had to be generated first.  
Aside from that, I also had issues trying to add circle icon with label onto google maps. It was difficult trying to think of the best way to workaround this issue, since there were multiple ways of doing it.

### Q) How did you find the test overall? Did you have any issues or have difficulties completing?If you have any suggestions on how we can improve the test, we'd love to hear them.
Overall, it was challenging to learn a framework that I have used before albeit only for a short while. I had issues trying to gather assets for the frontend, such as the icons used in the map.  
Also, I had no clue where to get the map widget shown in the design document, seeing it contains no brand features of Google.  
Some instructions were unclear, such as the unselection of map marker or hub. How does the user deselect one?