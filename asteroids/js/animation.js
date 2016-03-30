Asteroids.AnimationObjectIdx = 0;
Asteroids.AnimationManaged = function()
{
    var me = Asteroids.FloatingInSpace.call(this);
    // each object has an identifier
    var myId = ""+Asteroids.AnimationObjectIdx++;
    me.getId = function () { return myId; }
    me.setId = function(id) { myId = id; }
    // TODO JavaScript supports something like instanceof that should be able to be used
    // rather than defining a variable to differentiate types of sub-classes...
    var myType = '?';
    me.getMyType = function() { return myType; }
    me.setMyType = function(t) { myType = t; }
    /**
     * sub-class to implement, return true if animation should continue.
     * if an object manages its own animation then it should set this to null.
     **/
    me.animate = function ()
    {
        return false;
    }
    /**
     * sub-class to implement, called upon a collision with another object.
     **/
    me.collision = function (o) {}
    return me;
}
Asteroids.AnimationManaged.prototype = new Asteroids.FloatingInSpace();
Asteroids.AnimationManaged.prototype.constructor = Asteroids.AnimationManaged;

Asteroids.AnimationManager = function()
{
    var FPS = 60;
    var REFRESH = 1000/FPS; // refresh rate
    var timer = null;
    // these are the objects being animaged
    var objects = [];

    function doReset()
    {
        for ( var i = 0; i < objects.length; i++ )
        {
            if ( objects[i] != null && objects[i].clear )
            {
                objects[i].clear();
            }
            objects[i] = null;
        }
    }

    function doAddObject ( o )
    {
        if ( o.getId )
        {
            Utils.debug ( "AnimationManager.addObject with id " + o.getId() + "." );
            var idx = 0;
            for ( idx = 0; idx < objects.length; idx++ )
            {
                if ( objects[idx] == null )
                {
                    objects[idx] = o;
                    return;
                }
            }
            Utils.debug ( "AnimationManager.addObject extending array to add " + o.getId() );
            objects[objects.length]=o;
        }
    }
    function doRemoveObject ( o )
    {
        if ( o.getId )
        {
            Utils.debug ( "AnimationManager.removeObject with id " + o.getId() + "." );
            for ( var i = 0; i < objects.length; i++ )
            {
                if ( objects[i] == o )
                {
                    objects[i] = null;
                    break;
                }
            }
        }
    }
    function testCollision(o1,o2)
    {
        // the following checks are redundant with those in performAnimation but
        // included for completeness
        // 1.) if either is null then they can't collide.
        // 2.) an object cannot collide with itself
        // 3.) if either of the objects doesn't support collision detection then
        // they can't collide in a meaninful way
        if ( ( o1 == null || o2 == null ) || 
             ( o1 == o2 ) || 
             ( o1.collision == null || o2.collision == null ) )
              return false;
        // note collision detection is based on an object's "radius" which
        // for images is calculated by averaging half width/height
        // the implication being that images should be roughly square or
        // collision detection for them will be inaccurate (or need to be
        // reimplemented to be more intelligent)
        var o1x = o1.getX();
        var o1y = o1.getY();
        var o1r = o1.getRadius();
        
        var o2x = o2.getX();
        var o2y = o2.getY();
        var o2r = o2.getRadius();

        var dx = Math.abs(o1x-o2x);
        var dy = Math.abs(o1y-o2y);
        // calculate the hypotenuse a^2+b^2=c^2
        var hyp = Math.sqrt((dx*dx)+(dy*dy));
        // a collision has happened if the hypotenuse
        // is less than or equal to the sum of the two
        // object's radii
        return hyp <= (o1r+o2r);
    }

    function performAnimation()
    {
        for ( var i = 0; i < objects.length; i++ )
        {
            var o = objects[i];
            if ( o != null && 
                 o.animate != null &&
                !o.animate() ) doRemoveObject(o);
        }
        // see if any of the objects we just moved collided with one another
        for ( var i = 0; i < objects.length; i++ )
        {
            var o1 = objects[i];
            if ( o1 == null || o1.collision == null ) continue;
            for ( var j = 0; j < objects.length; j++ )
            {
                if ( i == j ) continue; // same object
                var o2 = objects[j];
                if ( o2 == null || o2.collision == null ) continue;
                if ( testCollision ( o1, o2 ) )
                {
                    Utils.debug ( "Object " + o1.getId() + " just collided with " + o2.getId() );
                    o1.collision(o2);
                    o2.collision(o1);
                    doRemoveObject(o1);
                    doRemoveObject(o2);
                    break;
                }
            }
        }
        // using setTimeout rather than setInterval in case one invocation of this
        // function exceeds the refresh rate duration, which seems possible.
        if ( !Asteroids.Game.isGameOver() &&
             !Asteroids.Game.isPaused() ) timer = setTimeout ( performAnimation, REFRESH );
    }

    return {
        start: function()
        {
            if ( timer != null ) clearTimeout ( timer );
            timer = setTimeout ( performAnimation, REFRESH );
        },
        stop: function()
        {
            if ( timer != null )
            {
                clearTimeout ( timer );
            }
        },
        addObject: function(o) // add an AnimationManaged object
        {
            doAddObject ( o );
        },
        removeObject: function(o)
        {
            doRemoveObject ( o );
        },
        reset: function () { doReset() }
    }
}();
// boot up the AnimationManager.
Asteroids.AnimationManager.start();
