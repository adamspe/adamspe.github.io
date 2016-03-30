/**
 * The Game bits that coordinate the parts.
 * author: adamspe@gmail.com
 **/
Asteroids.Game = function ()
{
	var loadTimer = null;
    var ship = null;
	var field_above = null;
	var field_below = null;
	var paused = true;
	var over = false;

	function unPause()
	{
		paused = false;
		Asteroids.AnimationManager.start();
	}
	function showButton(b)
	{
		b.css ( 'position', 'absolute' );
		b.css ( 'top', (window.innerHeight-130)+"px" );
		b.css ( 'left', (Math.floor((window.innerWidth/2))-20) + "px" );
		b.css ( 'z-index', 100 );
		b.css ( 'display', 'inline' );
	}
	function restart()
	{
		Asteroids.Score = 0;
		$('#score').html ( "Score: "+(Asteroids.Score) );
		Asteroids.AnimationManager.reset();
		field_above.reset();
		field_below.reset();
		paused = over = false;
		Asteroids.AnimationManager.start();
		ship.StartingPosition();
	}
	function init()
	{
		Utils.debug ( "Game.init" );
		$('canvas').each(function(idx){
			this.width=window.innerWidth;
			this.height=window.innerHeight;
		});
		Asteroids.StarField();
    	ship = new Asteroids.SpaceShip('asteroid_field_above');
		field_above = new Asteroids.AsteroidField('asteroid_field_above');
		field_below = new Asteroids.AsteroidField('asteroid_field_below');
		Asteroids.AnimationManager.addObject ( ship );

		// put the "Start" "button in place."
		// todo, genericize for more "buttons"
		var sg = $('#start_game');
		showButton ( sg );
		sg.bind ( 'click', function(evt){
			evt.target.style.zIndex = -100;
			evt.target.style.display = 'none';
			unPause();
		});
	}
	function load ()
	{
		var repoLoaded = Asteroids.ImageRepository.isLoaded();
		Utils.debug ( "Game.load - repo loaded: "+repoLoaded);
		if ( repoLoaded )
		{
			if ( loadTimer != null )
			{
				Utils.debug ( "clearInterval:"+loadTimer );
				clearInterval ( loadTimer );
			}
			init();
		}

	}
	return {
		pause: function () { paused = true; },
		isPaused: function() { return paused; },
		isGameOver: function() { return over; },
		load: function() { loadTimer = setInterval ( load, 500 ); },
		gameOver: function ()
		{
			over = true;
			var nb = $('#new_game' );
			showButton ( nb );
			nb.bind ('click',function(evt){
				evt.target.style.zIndex = -100;
				evt.target.style.display = 'none';
				restart();
			});
		}
	}
}();