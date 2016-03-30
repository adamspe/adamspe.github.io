/**
 * The SpaceShip and it's Ammunition!!
 *
 * author: adamspe@gmail.com
 **/
Asteroids.Score = 0;
Asteroids.Bullet = function(ship)
{
    var me = Asteroids.AnimationManaged.call(this);
    me.init('fireworks');
    me.setMyType ( 'bullet' );
    me.setId("Bullet-"+me.getId());

    var travelTimer = null;
    var REFRESH = 10;
    var dx = 0;
    var dy = -8;
    me.setCircleRadius ( 2 );
    me.setCircleColor ( '#ff0000' );
    me.setX(ship.getX());
    me.setY(ship.getY()-(ship.getImgHeight()/2)-5);
    me.draw();
    me.animate = function()
    {
        if ( me.getY() <= 0 ) // if traveled off the screen at the top..
        {
            me.clear();
            return false;
        }
        me.move ( dx, dy );
        return true;
    }
    me.collision = function (o)
    {
        $('#score').html ( "Score: "+(Asteroids.Score++) );
        me.clear();
    }
    Asteroids.AnimationManager.addObject ( me );
    return me;
}
Asteroids.Bullet.prototype = new Asteroids.AnimationManaged();
Asteroids.Bullet.prototype.constructor = Asteroids.Bullet;

Asteroids.SpaceShip = function (bind_mouse_events_to)
{
    var me = Asteroids.AnimationManaged.call(this);
    me.init('spaceship','SpaceShip','SpaceShipThrusters');

    me.setId ( 'TheShip' );
    var NORMAL_SHIP = 0;
    var THRUSTER_SHIP = 1;

    var KEY_MOVE=5;
    var RIGHT=76;
    var LEFT=74;
    var UP=73;
    var DOWN=75;
    var FIRE=32;

    var dead = false;

    me.StartingPosition = function()
    {
        Asteroids.AnimationManager.removeObject(me);
        me.clear();
        dead = false;
        var elm = me.getElement();
        // put the ship in the middle of the bottom of the screen
        me.setX ( elm.width/2 );
        me.setY ( elm.height-me.getImgHeight()-10 ); 
        Asteroids.AnimationManager.addObject(me);
        me.draw();
    }
    
    me.Fire = function()
    {
        if ( Asteroids.Game.isPaused() || dead ) return;
        Utils.debug ( "bang!" );
        var bullet = new Asteroids.Bullet(me);
    }

    me.MouseMovement = function(event)
    {
        if ( Asteroids.Game.isPaused() || dead ) return;
        var startingY = me.getY();
        me.clear();
        me.setMouseCoordinates(event);
        // if moving up using the thrusters version
        me.setImgIdx ( (me.getY()<startingY) ? THRUSTER_SHIP : NORMAL_SHIP );
        me.draw();
    }
    me.KeyDown = function(event)
    {
        if ( dead ) return;
        Utils.debug("KeyDown: "+event.keyCode);
        if ( event.keyCode == FIRE )
        {
            me.Fire();
            return;
        }
        var draw = event.keyCode == UP || event.keyCode == DOWN || event.keyCode == LEFT || event.keyCode == RIGHT;
        if ( draw )
        {
            me.clear();
            var dx = 0;
            var dy = 0;
            switch(event.keyCode)
            {
                case UP: { dy = -KEY_MOVE; break; }
                case DOWN: { dy = KEY_MOVE; break; }
                case LEFT: { dx = -KEY_MOVE; break; }
                case RIGHT: { dx = KEY_MOVE; break; }
            }
            me.setImgIdx ( (dy < 0) ? THRUSTER_SHIP : NORMAL_SHIP );
            me.setX(me.getX()+dx);
            me.setY(me.getY()+dy);
            me.draw();
        }
    }
    // spaceship controls its own animation
    me.animate = null;
    // but should be involved in collision detection
    me.collision = function (o)
    {
        Utils.debug ( "SpaceShip collision with " + o.getId() );
        if ( o.getMyType() != 'bullet' )
        {
            dead = true;
            Asteroids.Game.gameOver();
        }
        else Asteroids.AnimationManager.addObject(me);
    }
    me.delete = null;

    // the ship is a rectangular image so use its height, the shorter side
    // to calculate an approximate radius (with a fudge factor).
    me.getRadius = function()
    {
        var r = me.getImgHeight()/2;
        return r-20;
    }

    me.StartingPosition(); // on create.
    // setup event handling..
    var ipad  = 'createTouch' in document;
    $('#'+bind_mouse_events_to).bind(ipad ? 'touchmove' : 'mousemove',me.MouseMovement);
    $('#'+bind_mouse_events_to).bind(ipad ? 'touchstart' : 'mousedown',me.Fire);
    //$('body').bind('keydown',me.KeyDown);

    return me;
}
Asteroids.SpaceShip.prototype = new Asteroids.AnimationManaged();
Asteroids.SpaceShip.prototype.constructor = Asteroids.SpaceShip;