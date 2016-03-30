/**
 * Base class for things that float around in space.
 * author: adamspe@gmail.com
 **/
Asteroids.FloatingInSpace = function ()
{
    var element_id = null;
    var element = null;
    var ctx = null;
    var offset = null;
    var x = 0;
    var y = 0;
    var img_idx = 0;
    var imgs = [];
    var circle_radius = -1;
    var circle_color = '#ffffff';
    var scale = 1; // by default images drawn their true size
    
    // clears the current image from the canvas
    function doClear()
    {
        if ( imgs.length == 0 )
        {
            if ( circle_radius > 0 )
            {
                //ctx.clearRect(x-circle_radius,y-circle_radius,circle_radius*2,circle_radius*2);
                // ? fudge factor should not be necessary...
                ctx.clearRect(x-circle_radius-1,y-circle_radius-1,(circle_radius*2)+2,(circle_radius*2)+2);
            }
        }
        else
        {
            var img = imgs[img_idx];
            var w = Math.floor(img.width*scale);
            var h = Math.floor(img.height*scale);
            ctx.clearRect(x-(w/2),y-(h/2),w,h);
        }
    }
    // draws an image on the canvas
    function doDraw()
    {
        if ( imgs.length == 0 )
        {
            if ( circle_radius > 0 )
            {
                ctx.fillStyle=circle_color;
                ctx.beginPath();
                //arc(x,y,radius,statAngle,endAngle,antiClockwise)
                // x,y are the center
                ctx.arc(x,y,circle_radius,0,Math.PI*2,true);
                ctx.closePath();
                ctx.fill();
            }
        }
        else
        {
            var img = imgs[img_idx];
            var w = Math.floor(img.width*scale);
            var h = Math.floor(img.height*scale);
            ctx.drawImage (img,x-(w/2),y-(h/2),w,h);
        }
    }
    return {
        init: function(element_id)
        {
            element = Utils.getElementById(element_id);
            //element.me = this;
            ctx = Utils.get2dContext ( element_id );
            offset = $("#"+element_id).offset();
            if ( arguments.length > 1 )
            {
                for ( var i = 1; i < arguments.length; i++ )
                  imgs[i-1] = Asteroids.ImageRepository.get(arguments[i]);
            }
        },
        getElement: function() { return element; },
        setCtx: function(c) { ctx = c; },
        getCtx: function() { return ctx; },
        setMouseCoordinates: function(event)
        {
            var e = event;
            // don't let the main window handle the event (results in window scrolling on ipad).
            e.preventDefault();
            if ( event.originalEvent )
            {
                // ipad touch events...
                if ( event.originalEvent.touches && event.originalEvent.touches.length > 0 ) e = event.originalEvent.touches[0];
                else if ( event.originalEvent.changedTouches && event.originalEvent.changedTouches.length > 0 ) e = event.originalEvent.changedTouches[0];
            }
            x=e.pageX-offset.left;
            y=e.pageY-offset.top;
            //Utils.debug ("MouseCoordinates: ("+x+","+y+")");
        },
        getRadius: function()
        {
            if ( circle_radius != -1 ) return circle_radius;
            // otherwise the object's radius is based on the current images width/height.
            if ( imgs.length != 0 )
            {
                // average of half height and width.
                return ((imgs[img_idx].height/2)+(imgs[img_idx].width/2))/2;
                /*
                // the smaller of the two/2
                var d = imgs[img_idx].height<imgs[img_idx].width ? imgs[img_idx].height : imgs[img_idx].width;
                return Math.floor ( d/2 );
                */
            }  
            return -1; // ?
        },
        setCircleRadius: function(r) { circle_radius = r; },
        setCircleColor: function(c) { circle_color = c; },
        setX: function(nx) { x = nx; },
        setY: function(ny) { y = ny; },
        getX: function() { return x; },
        getY: function() { return y; },
        setScale: function (s) { scale = s; },
        getScale: function() { return scale; },
        getImgHeight: function() { return imgs.length != 0 ? imgs[img_idx].height : 0 },
        getImgWidth: function() { return imgs.length != 0 ? imgs[img_idx].width : 0 },
        getImgIdx: function() { return img_idx; },
        setImgIdx: function(idx) { img_idx = idx; },
        move: function(dx,dy)
        {
            doClear();
            x+=dx;
            y+=dy;
            doDraw();
        },
        clear: function() { doClear(); },
        draw: function() { doDraw(); }

    }
}