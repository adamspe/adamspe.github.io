---
layout: post
title:  "AngularJS Providers"
date:   2015-10-28 12:00:00
categories: angularjs
---

#AngularJS Providers

While working on a project I ran across the need to make directives configurable such that another app loading modules could tailor the behavior of pre-existing directives.  So I did some playing around with writing angular providers.  There are plenty of different ways to make this sort of thing happen since providers are very open ended things but for this simple use case I came up with this bit of code.

<p data-height="268" data-theme-id="0" data-slug-hash="GpdZGR" data-default-tab="js" data-user="adamspe" class='codepen'>See the Pen <a href='http://codepen.io/adamspe/pen/GpdZGR/'>Angular Directive Provider Example (Alternative)</a> by Paul Adams (<a href='http://codepen.io/adamspe'>@adamspe</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

`app-one` exposes a directive that simply displays an object using some markup.  `app-two` comes along and wants to re-use the directive but replace the template used to display the object.

The pen uses angular's `$templateCache` to avoid needing to include external files and in retrospect I suppose for the purposes of illustration I could have just as easily used the `template` attribute instead of the `templateUrl` attribute, but whatever, it's an illustration to play with an idea.