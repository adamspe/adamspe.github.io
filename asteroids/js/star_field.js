Asteroids.StarField = function ()
{
	var STAR_COUNT = 250;
	var STAR_RADIUSES = [1,2];
	var field = Utils.getElementById('star_field');
	var ctx = Utils.get2dContext ( 'star_field' );
	ctx.fillStyle='#ffffff'; // stars are white

    function draw_star()
    {
    	var x = Utils.rand(field.width);
    	var y = Utils.rand(field.height);
    	var radius = STAR_RADIUSES[Utils.rand(STAR_RADIUSES.length)];
    	Utils.debug ( "star: ("+x+","+y+") radius:"+radius);

		ctx.beginPath();
		//arc(x,y,radius,statAngle,endAngle,antiClockwise)
		// x,y are the center
		ctx.arc(x,y,radius,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
    }
    for ( var i = 0; i < STAR_COUNT; i++ ) draw_star();
}