---
layout: post
title:  "JavaScript/Canvas/Asteroids"
date:   2016-03-15 12:00:00
categories: javascript canvas
---

I happen to know a local highschool science teacher.  Over the years he has periodically sent students my way who thought they might be interested in becoming a software developer to talk and learn a little more about what it actually entails.

A few years back I was sent me a student who wanted help with writing a basic video game for the science fair.  I'm not sure a video game quite aligns with my idea of a science project (I tend to think baking soda volcano) but the main point he was interested in becoming a game developer and had grand dreams of writing a 3D first person shooter (with no software development experience and a very short time line).  After some discussion I convinced him to scale back his vision to something that might be more achievable in the time period and with his limited skill set.  Since I needed a simple and accessible language and wanted to avoid compiling, dealing with CLRs or window management, etc. I figured JavaScript was probably a pretty good choice of language.  Write some simple code in any text editor, open it in a browser, change it, refresh it to see the effect, lather rinse repeat.

I figured maybe I could get him working with [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) to write a 2D interactive game of some sort but at the time canvas was pretty new and most of my own JavaScript at that time (I was a full-time Java developer) was basic form validation kind of logic so I had some learning to do myself.  I figured this would be a good chance to learn about [prototypical inheritance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain) since any game would need "objects."  So I wrote my own "science project" in JavaScript with all hand drawn imagery.

What came out the other end was a basic Asteroids like game.  It's very basic and for a game isn't remotely feature rich but it was fun to write and an interesting learning experience.

It's not particularly challenging but if you'd like to try your hand at saving the galaxy, or at least breaking up a bunch of spinning rocks as they spin around the screen click the little (beautifully drawn) ship below.

<a href="/asteroids/" target="_blank"><img src="/asteroids/img/spaceship_thrusters.png" /></a>

I haven't gone back to look at the code with fresh eyes after several intervening years of writing more advanced JavaScript for customers now with an actual handle on closures and prototypical inheritance...