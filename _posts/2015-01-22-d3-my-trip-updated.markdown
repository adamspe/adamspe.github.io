---
layout: post
title:  "D3 Animated Map Visualization (Updated)"
date:   2015-01-23 12:00:00
categories: d3 mapping
d3trip: true
---
So I made some changes to the [My Pretend Summer Trip](/d3-trip/) visualization.  I disliked that it really was kind of unclear without reading the code that what you are looking at isn't just some animated gif or something.  It needed more basic interaction to make it not only more interesting but clear that the [D3] stuff is really cool and interactive.  So I added some controls.  The user interaction stuff would have been so much better with [AngularJS] but I chose to keep it simple'ish and just use pure JavaScript and HTML elements.

The new controls are:

- Map Tile Server - Lets you pick from several different tile servers to seed the map with (a mix of maps from [MapBox], [OpenStreetMap] and [MapQuest]).
- Transition Duration - Lets you pick from a few different durations dictating how long it takes to show markers and draw links.
- Clip Map - Lets you turn on the clipping path that makes it appear as if you're just looking at the lower 48 states.
- Link Color - Lets you change the color of the links.

The first two can only be changed after the animation has completed and there's a "Redraw" button to restart the animation.  The latter two can be changed even while the animation is in progress which is kinda cool.  I could of, of course, added more controls like marker color or arrow color (just orange) but that's not the point here.

This also gave me an opportunity to play with more [D3] DOM interactions, although again I'd almost certainly rather mix [AngularJS] into things and if they were to any more complicated.  But as a learning vehicle just raw JavaScript is suitable.

[D3]: http://d3js.org
[AngularJS]: https://angularjs.org/
[MapBox]: http://mapbox.com
[OpenStreetMap]: http://www.openstreetmap.org/
[MapQuest]: http://www.mapquest.com/