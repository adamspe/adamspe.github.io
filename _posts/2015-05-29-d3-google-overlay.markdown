---
layout: post
title:  "D3 Google Map Overlay"
date:   2015-05-29 12:00:00
categories: d3 mapping
---

For some work I'm about to do I need to do some more advanced visualizations over maps but don't really want to lose some of the functionality provided by Google Maps (as opposed to doing a pure d3 visualization which can be a little
close to the metal when dealing with zooming/projections, etc.).

While researching this I discovered [Google Maps + D3](https://gist.github.com/mbostock/899711).  This is a good start but I would like
to place SVG elements all within a single SVG document so I can do things like animate relationships between them, etc. and this example generates one SVG per marker.  In addition I want to be able to interact with the SVG elements
so I need to them to be able to receive mouse events.

I'm pretty sure I've figured out nice ways to do both of these things.  I copied (not forked) the source of
[Google Maps + D3](https://gist.github.com/mbostock/899711) and the results can be found [here](/d3-google-overlay/).

The trick to using a single SVG (at least an approach here) was to pre-process all the markers and create an instance of [google.maps.LatLngBounds](https://developers.google.com/maps/documentation/javascript/reference#LatLngBounds) that can then be used to determine how to size and position
the SVG.

E.g.

    // Load the station data. When the data comes back, create an overlay.
    d3.json("stations.json", function(data) {
      // fit the map to the boundaries of all available data points and
      // ONCE generate google LatLng objects to be re-used repeatedly
      var bounds = new google.maps.LatLngBounds();
      d3.entries(data).forEach(function(d){
        bounds.extend(d.value.lat_lng = new google.maps.LatLng(d.value[1], d.value[0]));
      });
      map.fitBounds(bounds);
      var overlay = new google.maps.OverlayView(),
          r = 4.5,
          padding = r*2;
      // Add the container when the overlay is added to the map.
      overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget)
            .append("svg")
            .attr('class','stations')
            .attr('width',window.innerWidth+'px')
            .attr('height',window.innerHeight+'px');
        overlay.draw = function(){
          var projection = this.getProjection(),
              sw = projection.fromLatLngToDivPixel(bounds.getSouthWest()),
              ne = projection.fromLatLngToDivPixel(bounds.getNorthEast());
          // extend the boundaries so that markers on the edge aren't cut in half
          sw.x -= padding;
          sw.y += padding;
          ne.x += padding;
          ne.y -= padding;

          d3.select('.stations')
            .attr('width',(ne.x - sw.x) + 'px')
            .attr('height',(sw.y - ne.y) + 'px')
            .style('position','absolute')
            .style('left',sw.x+'px')
            .style('top',ne.y+'px')
    ...

Then when placing markers their position needs to just be adjusted by the values of `sw.x` and `ne.y`.

E.g.

    .attr('cx',function(d) {
      d = projection.fromLatLngToDivPixel(d.value.lat_lng);
      return d.x-sw.x;
    })
    .attr('cy',function(d) {
      d = projection.fromLatLngToDivPixel(d.value.lat_lng);
      return d.y-ne.y;
    })

As for dealing with mouse events it turns out it's just a matter of using the `overlayMouseTarget` layer instead of the `overlayLayer`.

I.e.

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget)
                .append(...)
        ...
    }

