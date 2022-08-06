/**
 * gproto.js
 * @author Krzysztof Cieslak
 * @version v1.0 (beta)
 *
 */

var mx=0;
var my=0;
var rot=1;
var bnr=1;
var nbnr;
var ivID;
var time=1000;
var level=0;
var score=0; 
var YD=YAHOO.util.Dom;
var YE=YAHOO.util.Event;
var YA=YAHOO.util.Anim;
var $ = function (el) { return YD.get(el);}
YE.addListener(window,'load',OnLoad);
var logoanim = {};
var contGameOver = {};
var intro = {};
// * YAHOO LOGO ANIMATION -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==--=-=-=-=
logoanim.init = function () {
 		          this.logo = new YA('logo', {
 	                    width: {to: 65+10 }, height: { to: 38+10 }
			                                }, 0.25,YAHOO.util.Easing.eraseOut);
                  this.logo.onComplete.subscribe(function () {
                        var  logo1 = new YA('logo', { width: {  to: 65, unit: '%' },
	                        height: {  to: 38, unit: '%' } 
							  }, 0.25,YAHOO.util.Easing.eraseOut);
                            logo1.animate(); 
							  } );
}
logoanim.start = function () { this.logo.animate(); }

// * GAME OVER ANIMATION -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==--=-=-=-=
contGameOver.init = function () {
 	             this.cont = new YA('container', { opacity: { to: 0 } },2);
				 this.cont.onStart.subscribe(function () {
				 GameOver();
				 YE.removeListener(document,'keydown');
				 });
				 this.cont.onComplete.subscribe(function () {
				 	    clearBoard();
						YD.setStyle('container','opacity','100');
						intro.start();
						                       });
}
contGameOver.start = function () { this.cont.animate(); }
// * INTRO ANIMATION -=--=-==--=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-==--=-=-=-=-=-=-=-=-=
intro.init = function () {
	             YD.setStyle('inlogo','opacity','0');
				 this.t1= new YA('t2', {fontSize:{ from: 1, to: 2, unit:'em' }},0.25,YAHOO.util.Easing.easeOut);
				 this.t1.onComplete.subscribe(function () {
				   t1a= new YA('t2', {fontSize:{ from: 2, to: 1, unit:'em' }},0.25,YAHOO.util.Easing.easeOut);
				   t1a.animate(); 	
				 });
				 this.i = new YA('inlogo', {opacity: {to: 60 } },4, YAHOO.util.Easing.easeIn );
				 this.i.onStart.subscribe(function () {
				 	 YD.setStyle('inlogo','opacity','0');
				 	});
				 }
intro.start= function () {
	             YD.setStyle('inlogo','display','block');   
				 YD.setStyle('intxt','display','block');
	             this.i.animate();
				 this.t1.animate();
			             }
intro.stop = function () { 
                 YD.setStyle('inlogo','display','none');
                 YD.setStyle('intxt','display','none');				   
				 }
YE.onAvailable('container',function () {logoanim.init(); });
YE.onAvailable('logo',function () {contGameOver.init(); });
YE.onAvailable('inlogo',function () {intro.init(); });

function Rand() {
	var n=Math.floor(Math.random()*8);
	if (n==0) n=1; 
	if (n==8) n=7; 
	return n; }

	
function OnLoad() {
	var box;
	for (var i=0;i<12;i++) {
	  for (var j=0;j<16;j++) {
		 box= document.createElement('div');
	     box.className='box';
         box.style.top=j*24+'px';
		 box.style.left=i*24+'px';
		 box.id=i+'x'+j;
		 $('container').appendChild(box);
	    }	 		
	}
	for (var i=0;i<4;i++) {
	  for (var j=0;j<4;j++) {
	  	box= document.createElement('div');
		box.className='box';
		box.style.top=((j*24)+15)+'px';
		box.style.left=((i*24)+15)+'px';
		box.id=(12+i)+'x'+(16+j);
		$('nxin').appendChild(box);
	 }
	}
	// animation -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==--==--=-=-=-=-=-=-=-=
//	contGameOver.init();
//	intro.init();
	
    // eof animation -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// SET EVENTs
	YE.addListener('btn','click',btnClick);
	YE.addListener('btn','mouseout',function () { $('btn').className='btnoff'; });
	YE.addListener('btn','mouseover',  function () { $('btn').className='btnover'; })
	
	
	YE.addListener('logo','mouseover', function () { logoanim.start(); } );
	intro.start();
}

function btnClick() {
	$('btn').className='btnon';
	startGame();
}
function startGame() {
	YE.removeListener(document,'keydown');
	YE.addListener(document,'keydown',Movement);
	intro.stop();
	window.clearInterval(ivID); 
	clearBoard();
	clearNextBox();
	level=0; time=1000; score=0;
	$('levelbox').innerHTML='Level: '+level;
	$('scorebox').innerHTML='Score: '+score;
    mx=5; my=1; rot=1; bnr=nbnr=Rand();
	putFigure(mx,my,bnr,rot,1);	 
	ivID=window.setInterval(MoveDown, time);
} 
function MoveDown()  { 
         putFigure(mx,my,bnr,rot,0);  
		 my++; 
		 if (!putFigure(mx,my,bnr,rot,1)) {
		 	  my--; putFigure(mx,my,bnr,rot,1);
		 	  window.clearInterval(ivID);
		 	  checkLine();
			  switch (level) {
			  	case 1: time=800; break;
				case 2: time=700; break;
				case 3: time=600; break;
				case 4: time=500; break;
				case 5: time=400; break;
				case 6: time=450; break;
				case 7: time=300; break;
				case 8: time=200; break;
				case 9: time=100; break;
			   case 10: time=0; break;
			  }
              mx=5; my=1; rot=1; bnr=nbnr; //Rand();
	         if (!putFigure(mx,my,bnr,rot,1)) {
			  	          window.clearInterval(ivID);
						  contGameOver.start();
						  clearNextBox();
						  
					                           } else { 
			  
			  nbnr=Rand();
			  switch (bnr) {
			  	case 1:	putFigure(13,17,bnr,1,0); break;
				case 2:	putFigure(14,17,bnr,1,0); break;
				case 3:	putFigure(13,18,bnr,1,0); break;
				case 4:	putFigure(13,17,bnr,1,0); break;
				case 5:	putFigure(14,17,bnr,1,0); break;
				case 6:	putFigure(13,17,bnr,1,0); break;
				case 7:	putFigure(13,18,bnr,1,0); break;
			  }
			  switch (nbnr) {
			  	case 1:	putFigure(13,17,nbnr,1,1); break; 
				case 2:	putFigure(14,17,nbnr,1,1); break; 
				case 3:	putFigure(13,18,nbnr,1,1); break; 
				case 4:	putFigure(13,17,nbnr,1,1); break; 
				case 5:	putFigure(14,17,nbnr,1,1); break;
				case 6:	putFigure(13,17,nbnr,1,1); break;
				case 7:	putFigure(13,18,nbnr,1,1); break; 
			  }
			  ivID=window.setInterval(MoveDown, time);
			                                  }
			                              }
		             }

function Movement(e) {
	switch (YAHOO.util.Event.getCharCode(e)) {
		case (40): // down 
		  putFigure(mx,my,bnr,rot,0); my++; 
		  if (!putFigure(mx,my,bnr,rot,1)) { my--; putFigure(mx,my,bnr,rot,1); }
		  break; 
		case (37): // left
		  putFigure(mx,my,bnr,rot,0); mx--; 
		  if (!putFigure(mx,my,bnr,rot,1)) { mx++; putFigure(mx,my,bnr,rot,1); }
		  break;
		case (39): //right
		  putFigure(mx,my,bnr,rot,0); mx++; 
 		  if (!putFigure(mx,my,bnr,rot,1)) { mx--; putFigure(mx,my,bnr,rot,1); }
		  break;
		case (38): // rotate
		  putFigure(mx,my,bnr,rot,0); z=rot; rot++;  
		  if (rot==5) rot=1;
		  if (!putFigure(mx,my,bnr,rot,1)) { rot=z; putFigure(mx,my,bnr,rot,1); }
		  break;
		case (27): // quit
		  YE.removeListener(document,'keydown');
		  window.clearInterval(ivID);
		  clearBoard();
		  clearNextBox();
		  intro.start();
          level=0;  score=0; mx=0; my=0; 
      	  $('levelbox').innerHTML='Level: '+level;
	      $('scorebox').innerHTML='Score: '+score;
		  break;  
	}
}

function pB(x,y,state) {
	if (state==1) $(x+'x'+y).className='onbox';
   	if (state==0) $(x+'x'+y).className='box';
}

function cB(x,y) {
	if ($(x+'x'+y)) {
	   if ($(x+'x'+y).className=='box') return true; else return false;
	                } else return false;
}

function pF(x,y,x1,y1,x2,y2,x3,y3,s) {
  if (s==1) {
  if ((cB(x,y)) &&  (cB(x1,y1)) &&  (cB(x2,y2)) &&  (cB(x3,y3)))  
     { pB(x,y,s); pB(x1,y1,s); pB(x2,y2,s); pB(x3,y3,s); return true; }
  else return false;
            }
  else	{pB(x,y,s); pB(x1,y1,s); pB(x2,y2,s); pB(x3,y3,s); return true; }		
}

function putFigure(x,y,nr,rot,s) {
	switch (nr) {
		case 1:
		if (rot==1) { return pF(x,y,x,y-1,x,y+1,x+1,y+1,s); }
		if (rot==2) { return pF(x,y,x+1,y,x-1,y,x-1,y+1,s); }
		if (rot==3) { return pF(x,y,x,y+1,x,y-1,x-1,y-1,s); }
		if (rot==4) { return pF(x,y,x-1,y,x+1,y,x+1,y-1,s); }
		break;
		case 2:
		if (rot==1) { return pF(x,y,x,y-1,x,y+1,x-1,y+1,s); }
		if (rot==2) { return pF(x,y,x+1,y,x-1,y,x-1,y-1,s); }
		if (rot==3) { return pF(x,y,x,y+1,x,y-1,x+1,y-1,s); }
		if (rot==4) { return pF(x,y,x-1,y,x+1,y,x+1,y+1,s); }
		break;
		case 3:
	    return pF(x,y,x,y-1,x+1,y-1,x+1,y,s); 
		break;
		case 4:
		if (rot==1) { return pF(x,y,x+1,y-1,x+1,y,x,y+1,s); }
		if (rot==2) { return pF(x,y,x+1,y+1,x,y+1,x-1,y,s); }
		if (rot==3) { return pF(x,y,x-1,y+1,x-1,y,x,y-1,s); }
		if (rot==4) { return pF(x,y,x-1,y-1,x,y-1,x+1,y,s); }
		break;
        case 5:
		if (rot==1) { return pF(x,y,x-1,y-1,x-1,y,x,y+1,s); }
		if (rot==2) { return pF(x,y,x+1,y-1,x,y-1,x-1,y,s); }
		if (rot==3) { return pF(x,y,x+1,y+1,x+1,y,x,y-1,s); }
		if (rot==4) { return pF(x,y,x-1,y+1,x,y+1,x+1,y,s); }
		break;
        case 6:
		if (rot==1) { return pF(x,y,x,y-1,x,y+1,x,y+2,s); }
		if (rot==2) { return pF(x,y,x+1,y,x-1,y,x-2,y,s); }
		if (rot==3) { return pF(x,y,x,y+1,x,y-1,x,y-2,s); }
		if (rot==4) { return pF(x,y,x-1,y,x+1,y,x+2,y,s); }
		break;
		case 7:
		if (rot==1) { return pF(x,y,x-1,y,x,y-1,x+1,y,s); }
		if (rot==2) { return pF(x,y,x,y-1,x+1,y,x,y+1,s); }
		if (rot==3) { return pF(x,y,x+1,y,x,y+1,x-1,y,s); }
		if (rot==4) { return pF(x,y,x,y+1,x-1,y,x,y-1,s); }
		break;
	}
}

function clearBoard() {
	for (var i=0;i<16;i++) 
            for (var j=0;j<12;j++) 
				 $(j+'x'+i).className='box';
                      }
function clearNextBox() {
	for (var i=16;i<20;i++) 
            for (var j=12;j<16;j++) 
				 $(j+'x'+i).className='box';

}


function checkLine() {
  var Line = function(y) {
     var n=0;
   	 for (var i=0;i<12;i++) if (YD.hasClass($(i+'x'+y),'onbox')) n++;  
	 if (n==12) return true; else return false; 
                         }
  for (var z=0;z<16;z++) { 
      if (Line(z)) {
               	       
					   for (var i=z;i>0;i--) 
       	                  for (var j=0;j<12;j++) 
                               	 $(j+'x'+i).className=$(j+'x'+(i-1)).className;
						score=score+2;
						$('scorebox').innerHTML='Score: '+score;
						if ((score%80)==0) {
  						      level++;
							  $('levelbox').innerHTML='Level: '+level;
					    }
	               }
	                    }  
}
function GameOver() {
 time=0; 
 ivID=window.setInterval(function (){
 	              for (var i=0;i<12;i++) $(i+'x'+time).className='onbox';              
 	              time++;
				  if (time==16)  window.clearInterval(ivID); 
                        },50);
}