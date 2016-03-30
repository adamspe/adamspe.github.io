---
layout: post
title:  "SVG stroke-dasharray"
date:   2016-03-15 12:00:00
categories: svg d3
---

So I had written a d3/angular component to render a legned for a customer.  Each legend cell was a simple stroked rectangle.  They wanted to update the functionality so that some portions of the legend weren't delineated by vertical separators.  Rather than not stroking the individual cells and drawing separate lines it felt cleaner to update how undlineated cells should be stroked in place (not to mention it was a good opportunity to learn a bit more about `stroke-dasharray`).  So I wrote a little [pen](http://codepen.io/adamspe/pen/oxBEQM) using SASS to generate strokes for different sides of rectangles to sort out for myself the functionality.

<p data-height="268" data-theme-id="0" data-slug-hash="oxBEQM" data-default-tab="result" data-user="adamspe" class="codepen">See the Pen <a href="http://codepen.io/adamspe/pen/oxBEQM/">SVG stroke-dasharray boxes</a> by Paul Adams (<a href="http://codepen.io/adamspe">@adamspe</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>