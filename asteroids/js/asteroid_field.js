
/**
 * The AsteroidField and its Asteroids.
 * author: adamspe@gmail.com
 *
 * TODO : on "new game" exploded asteroids aren't cleared from the field
 * because they're "orphans"
 **/
Asteroids.Asteroid = function(asteroid_field)
{
	var me = Asteroids.AnimationManaged.call(this);
	var asteroidField = asteroid_field;
	var field_id = asteroidField.getFieldId();
	var field = Utils.getElementById(field_id);
	// initialize me
	me.init(field_id,
		'Asteroid','Asteroid45','Asteroid90','Asteroid135','Asteroid180',
		'Asteroid225','Asteroid270','Asteroid315','Explosion');
	me.setId("Asteroid-"+me.getId() );
	var ASTEROID_IDX = 0;
	var EXPLOSION_IDX = 8;
	var MAX_ASTEROID_IDX = 7;
	me.setMyType ( 'asteroid' );
	var SIZES = [1,.75,.5];
	// indexes into SIZES (which are scales)
	var LARGE = 0;
	var MEDIUM = 1;
	var SMALL = 2;

	var mySize = 0;

	me.setSize = function(sz)
	{
		mySize=sz;
		me.setScale(SIZES[mySize]);
	}
    // by default pick a small/medium/large asteroid randomly
    me.setSize ( Utils.rand(2) );
	
    // distiance to travel along the vector
    var SPEEDS = [1,3,5]
    var HYPOTENUSE = 2
	// deltas in x/y when traveling along this object's vector
	var dx = 0;
	var dy = 0;
	var angle = 270;

	var rotate_cnt = 0;
	var ROTATION_SPEEDS = [5,6,7,8,20];
	var rotate_on = ROTATION_SPEEDS[Utils.rand(ROTATION_SPEEDS.length-1)];
	var rotate_clockwise = (Utils.rand(1000)%2)==0;
	
	me.calculateDxDy = function()
	{
		if ( angle == 270 ) // traveling straight down
		{
			dy = HYPOTENUSE;
		}
		else
		{
			// for ease convert to absolute # relative to 270
			var relative_angle = (angle > 270) ? (angle-270) : (270-angle);
			var radians = Utils.deg2rad(relative_angle);
			// cos(riadians)=dy/HYPOTENUSE
			// dy=cos(radians)*HYPOTENUSE
			dy = Math.ceil(Math.cos(radians)*HYPOTENUSE);
			dx = Math.ceil(Math.sin(radians)*HYPOTENUSE);
			if ( dx == 0 && dy == 0 )
			  Utils.error ( me.getId() + "calculated dx & dy of zero!" );
			if (angle > 270 ) dx = -dx;
		}
	}

   	me.getSpeed = function () { return HYPOTENUSE; }
   	me.setSpeed = function (s) { HYPOTENUSE = s; me.calculateDxDy(); }
   	// by default pick a speed at randum
   	me.setSpeed ( SPEEDS[Utils.rand(SPEEDS.length-1)] );
	me.setAngleOfTravel = function(a) { angle = a; me.calculateDxDy(); }

	// by default pick an angle between 225 & 315 (which are always generally downard)
	me.setAngleOfTravel(Utils.rand(90)+225);

	Utils.debug ( "Asteroid size: "+ mySize +" vector - angle: " + angle + " dx:" + dx + " dy: " + dy + " rotate_on: "+ rotate_on + " rotate_clockwise: " + rotate_clockwise );
	me.setY(-me.getImgHeight()); // put the asteroid off the field
	// pick a somewhere along the X axis
	me.setX(Utils.rand(field.width));

	me.animate = function()
	{
		var cx = me.getX();
		var cy = me.getY();
		//Utils.debug ( "("+cx+","+cy+") ("+field.width+"x"+field.height+")");
		if ( cy >= field.height || cx <= 0 || cx >= field.width )
		{
			me.clear();
			asteroidField.asteroidLeavingField(me);
			return false; // animation complete
		}
		if ( rotate_cnt >= rotate_on )
		{
			rotate_cnt = 0;
			var iidx = me.getImgIdx();
			if ( iidx != EXPLOSION_IDX )
			{
				// rotate the asteroid.
				iidx += ( rotate_clockwise ) ? 1 : -1;
				if ( iidx < ASTEROID_IDX ) iidx = MAX_ASTEROID_IDX;
				else if (iidx>MAX_ASTEROID_IDX) iidx = ASTEROID_IDX;
				me.setImgIdx(iidx);	
			}
		}
		me.move ( dx, dy );
		rotate_cnt++;
		return true;
	}
	me.explode = function()
	{
		me.clear();
		asteroidField.asteroidLeavingField(me);
		me.setImgIdx(EXPLOSION_IDX); // 'Explosion'
		me.setScale(1);
		me.setCtx ( Utils.get2dContext ( 'explosions' ) );
		me.collision = null; // no longer part of collision detection
		//me.setId(me.getId()+"-Explosion");
		me.doStart();
	}
	me.collision = function(o)
	{
		var brokenSize = -1;
		switch ( mySize )
		{
			case SMALL :
				Utils.debug ( "Small collision." );
				me.explode();
				break;
			case MEDIUM :
			    // break a medium into two smalls
			    Utils.debug ( "Medium collision." );
			    brokenSize = SMALL;
			    break;
			case LARGE :
			    // break a large into two mediums
			    Utils.debug ( "Large collision." );
			    brokenSize = MEDIUM
			    break;
		}
		if ( brokenSize != -1 )
		{
			me.clear();
		    var a0 = new Asteroids.Asteroid ( asteroidField );
		    a0.setSpeed ( me.getSpeed() );
		    a0.setX(me.getX()); a0.setY(me.getY());
		    a0.setSize ( brokenSize );
		    // this is the left asteroid, set its angle of travel somewhere between 270-315
		    // (generally towards the left)
		    a0.setAngleOfTravel ( Utils.rand(45)+270 );

		    var a1 = new Asteroids.Asteroid ( asteroidField );
		    a1.setSpeed ( me.getSpeed() );
		    a1.setSize ( brokenSize );
		    a1.setX(me.getX()+(a1.getRadius()*2)+1); a1.setY(me.getY());
		    // this is the right asteroid set its angle of travel somewhere between 225-270
		    a1.setAngleOfTravel ( Utils.rand(45)+225 );
		    // to maintain the correct asteroid field density, just replace one that
		    // the asteroid field manages/replaces..
		    asteroidField.replaceAsteroid(me,a0);
		    a0.doStart();
		    a1.doStart();
		}


	}
	me.doStart = function()
	{
		me.draw();
		Asteroids.AnimationManager.addObject ( me );
	}
	me.start = function()
	{
		me.doStart();
		//setTimeout ( me.doStart, Utils.rand(2000) ); // actually start any time between now and two seconds from now.
	}
	
    return me;
}
Asteroids.Asteroid.prototype = new Asteroids.AnimationManaged();
Asteroids.Asteroid.prototype.constructor = Asteroids.Asteroid;

Asteroids.AsteroidFieldBase = function()
{
	return {
		
	};
}
Asteroids.AsteroidField = function(field_id)
{
	var me = Asteroids.AsteroidFieldBase.call(this);
	var fieldId = field_id;
	var field = Utils.getElementById(field_id);
	var density = 3;
	var asteroids = [];
	var spawned_asteroids = []; // these asteroids result from a collision of some sort...
	me.getFieldId = function() { return fieldId; }
	me.asteroidLeavingField = function(asteroid)
	{
		var lid = asteroid.getId();
		Utils.debug ( fieldId+".asteroidLeavingField " + lid );
		// replace with a new one..
		for ( var i = 0; i < asteroids.length; i++ )
		{
			if (asteroids[i].getId() == lid )
			{
				asteroids[i] = new Asteroids.Asteroid(me);
				Utils.debug ( fieldId+".asteroidLeavingField added " + asteroids[i].getId() + " to replace " + lid );
				asteroids[i].start();
				return;
			}
		}
		// asteroid may be as a result of a collision and not being tracked by this field.
		Utils.warn ( fieldId+".asteroidLeavingField " + lid + " not found?" );
	}
	me.replaceAsteroid = function(asteroid1, asteroid2)
	{
		var rid = asteroid1.getId();
		Utils.debug ( fieldId+".replaceAsteroid " + rid + " with " + asteroid2.getId() );
		for ( var i = 0; i < asteroids.length; i++ )
		{
			if ( asteroids[i].getId() == rid )
			{
				asteroids[i] = asteroid2;
				return;
			}
		}
		Utils.warn ( fieldId+".replaceAsteroid " + rid + " not found?" );
	}
	me.reset = function()
	{
		for ( var i = 0; i < density; i++ )
		{
			asteroids[i] = new Asteroids.Asteroid(me);
			Utils.debug ( fieldId+".reset added " + asteroids[i].getId() );
			asteroids[i].start();
		}
	}

	me.reset();

	return me;
}
Asteroids.AsteroidField.prototype = new Asteroids.AsteroidFieldBase();
Asteroids.AsteroidField.prototype.constructor = Asteroids.AsteroidField;