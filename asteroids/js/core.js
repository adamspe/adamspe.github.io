/**
 * Common  utilities.
 * author: adamspe@gmail.com
 **/
var Utils = function()
{
    return {
        debug: function(txt) { console.debug(txt); },
        info: function(txt ) { console.info(txt); },
        error: function(txt) { console.error(txt); },
        warn: function(txt) { console.warn(txt); },
        getElementById: function(element_id)
        {
            return document.getElementById ( element_id );  
        },
        get2dContext: function(element_id)
        {
            return document.getElementById ( element_id ).getContext ( '2d' );
        },
        rand: function(max)
        {
            return Math.floor(Math.random()*(max+1));
        },
        deg2rad: function(deg)
        {
            return (deg*Math.PI/180);
        }
    };
}();

Asteroids = {}; // base namespace.

/**
 * Responsible for loading all the images of the game.
 **/
Asteroids.ImageRepository = function ()
{
    var Images = {
        'SpaceShip': { src: 'img/spaceship.png', img: new Image() },
        'SpaceShipThrusters': { src: 'img/spaceship_thrusters.png', img: new Image() },
        'Asteroid' : { src: 'img/asteroid.png', img: new Image() },
        'Asteroid45' : { src: 'img/asteroid45.png', img: new Image() },
        'Asteroid90' : { src: 'img/asteroid90.png', img: new Image() },
        'Asteroid135' : { src: 'img/asteroid135.png', img: new Image() },
        'Asteroid180' : { src: 'img/asteroid180.png', img: new Image() },
        'Asteroid225' : { src: 'img/asteroid225.png', img: new Image() },
        'Asteroid270' : { src: 'img/asteroid270.png', img: new Image() },
        'Asteroid315' : { src: 'img/asteroid315.png', img: new Image() },
        'Explosion' : { src: 'img/explosion.png', img: new Image() }
    };
    var TotalCount = 0;
    var LoadCount = 0;
    return {
        isLoaded: function () { return LoadCount == TotalCount; },
        load: function()
        {
            for ( var key in Images ) { TotalCount++; }
            for ( var key in Images )
            {
                var io = Images[key];
                io.img.onload= function() { LoadCount++; }
                io.img.src="";
                io.img.src=io.src;
            }
        },
        get: function(key)
        {
          if ( Images[key] ) return Images[key].img; 
        }
    }
}();
Asteroids.ImageRepository.load();