
/**
 * @authors xiwang
 * @date    2017-04-10 14:31:18
 * @version 1.0
 */

 'use strict';
 // 定义 canvas 宽高
var ww,wh,
	canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d');
winSize();
function winSize(){
	ww = document.documentElement.clientWidth;
	wh = document.documentElement.clientHeight;
	if( ww > 750){
		canvas.setAttribute('style' , 'margin:0 auto;');
		canvas.width = 750;
		canvas.height = wh;
	}else{
		canvas.width = ww;
		canvas.height = wh;
	}
};
 // 玩具位置
 var toyY = wh - 170;
 // imgx : img 坐标数组 ; imgt : 实时图片排序 
var imgx = [],imgt = [];
 // 平分屏幕
var bw = Math.floor(ww / 3);
 // 玩具范围的数组
var toyScope = [];

// 玩具
var imgUrl = [
	{ url:'./img/img01.png', data:'2.88'},
	{ url:'./img/img02.png', data:'25.8'},
	{ url:'./img/img03.png', data:'15.8'},
	{ url:'./img/img04.png', data:'谢谢参与'},
	{ url:'./img/img07.png', data:'这是06号图片'},
	{ url:'./img/img08.png', data:'这是07号图片'}
];
// 创建 img 实例数组
var imgArr = [];
for( var i in imgUrl){
	var cimg = new Image();
	cimg.src = imgUrl[i].url;
	imgArr.push({img:cimg , data:imgUrl[i].data});
}

function play(){
	// 玩具数量
	var toyLen = imgUrl.length;
	// img x轴坐标 存入 imgx
	// img 实时排序 存入 imgt
	for( var i in imgArr ){
		var y = toyY , 
			w = 60 , 
			h = 80;
		var bgy = y - 60,
			bgw = w - 20,
			bgh = h - 25;
			// 前排
			imgx.push( (w+Math.floor((bw-w))) *i+Math.floor((bw-w)/2) );
			imgt.push( {img:imgArr[i].img , data:imgArr[i].data} );
		
			if(imgx.length > toyLen){
				// 前排
				imgx.pop();
				imgt.pop();
			}
	} 

	// 清除 上个位置的图片 并 新位置绘制图片
	for( var n in imgx ){
		ctx.clearRect( imgx[n] , y , 2 , h);
		
		// 前排
		imgx[n]+=2;
		if( imgx[n] > ww-(w/2) ){
			imgx[n] = imgx[0]-(w+Math.floor(bw-w));
			// 排序 坐标 数组
			bubbleSort(imgx);
			imgt.unshift(imgt.pop());
		}
		
		// 放入 玩具数组
		toyScope.push({ x:imgx[n] , y : y , width : w ,height: h, data : imgt[n].data});
		if( toyScope.length > toyLen ){
			toyScope.shift();
		}

		// 前排
		ctx.drawImage(imgt[n].img, imgx[n] , y, w ,h );
	}


}
	
 var toysTimer;
 // 范围内产生随机数 n最小数值 m最大数值
 function randomNum( n , m){
 	var num = m-n+1;
 	return Math.floor(Math.random()*num + n);
 }
 function rdTime(){
 	clearInterval(toysTimer);
 	var n = randomNum( 1 , 60);
 	toysTimer  =  setInterval(play, n )
 }
var rdSetTime = setInterval(rdTime,800);


 // 创建钩子
var hint = [
	'./img/img05.png', // 爪子
	'./img/img06.png', // 线
	'./img/img07.png', // 抓取按钮
	'./img/img08.png'  // 按下抓取按钮
];

// 爪子和线
var lineH = 10,headY = 30;

// 爪子和线的数组
var lineHead = [
	{x : ww/2 - 20 , y : headY , width : 40 , height : 40 , }, // 爪子
	{x : ww/2 - 5 , y : 20 , width : 10 , height : lineH , }, // 线
]
 // 事件范围的数组
var funScope = [
	{ x:ww - 120 , y : wh - 60 , width : 80 ,height: 40},// 抓取按钮
];
createImg(hint[0],lineHead[0]); // 绘制爪子
createImg(hint[1],lineHead[1]); // 绘制线
createImg(hint[2],funScope[0]); // 绘制抓取按钮

// 创建图片
function createImg( imgsrc , xywh ){
	var imag = new Image();
	imag.src =  imgsrc;
	imag.onload = function(){
	   	ctx.drawImage(imag , xywh.x , xywh.y , xywh.width , xywh.height );
	}
}

// 头部灰杠
ctx.fillStyle = '#555';
ctx.fillRect(0,0,ww,20);


// 爪子下落
function drop(){
	var n = 1;
	ctx.clearRect( lineHead[0].x , lineHead[0].y, lineHead[0].width , n);
	lineH+=n;
	lineHead[1].height = lineH;
	headY+=n;
	lineHead[0].y = headY;
	createImg(hint[0],lineHead[0]); // 绘制爪子
	createImg(hint[1],lineHead[1]); // 绘制线

}




// 手指按下
canvas.addEventListener('touchstart',function(e){
	var p = getEventPosition(e);
	if( fnS(funScope,p) == 0 ){
		createImg(hint[3],funScope[0]); // 绘制按下抓取按钮
	}
},false)
// 手指按下
canvas.addEventListener('touchend',function(e){
	var p = getEventPosition(e);
	if( fnS(funScope,p) == 0 ){
		createImg(hint[2],funScope[0]); // 绘制抓取按钮
	}
},false)
// 手指点击 
var status = 1;
canvas.addEventListener('click',function(e){
	var p = getEventPosition(e);
	if( fnS(funScope,p) == 0 ){
		if(status == 1){
			var timer = setInterval( function(){
				drop();
				if( headY > toyY ){
					clearInterval(toysTimer);
					clearInterval(rdSetTime);
					clearInterval(timer);
					// 爪子停下时算命中目标点的坐标
					var hit = [
						{ x : lineHead[0].x , y : lineHead[0].y },
						{ x : lineHead[0].x+lineHead[0].width , y : lineHead[0].y+lineHead[0].height },
					];
					var hitNum = fnS(toyScope,hit[0]),
						hitNum2 = fnS(toyScope,hit[1]);
					
					if( hitNum && hitNum2){

						alert(toyScope[hitNum].data);

					}else{
						alert('不好意思，没有抓到');
					}
					// setTimeout(function(){
					// 	window.location.reload();
					// },1000)

				}
			} ,10);
			
			status = 0;
		}
	}
},false)
// 获取点击坐标
function getEventPosition(ev){  
  var x, y;  
  if (ev.layerX || ev.layerX == 0) {  
    x = ev.layerX;  
    y = ev.layerY;  
  } else if (ev.offsetX || ev.offsetX == 0) { // Opera  
    x = ev.offsetX;  
    y = ev.offsetY;  
  }  
  return {x: x, y: y};  
} 
// 判断 点击坐标 是否在你需要的位置 
function fnS(arr,p){
　　var who = '';
	arr.forEach(function(v, i){
	　　ctx.beginPath();
	　　ctx.rect(v.x, v.y, v.width, v.height);
		　　//如果传入了事件坐标，就用isPointInPath判断一下
	　　if(p && ctx.isPointInPath(p.x, p.y)){
		　　//如果当前环境覆盖了该坐标，就将当前环境的index值放到数组里
	　　　　who = i;
	　　}

　　});
　　//根据who相应的值找到元素。
　　return who;
}
// 数组冒泡排序
function bubbleSort(array){
    /*给每个未确定的位置做循环*/
    for(var unfix=array.length-1; unfix>0; unfix--){
      /*给进度做个记录，比到未确定位置*/
      for(var i=0; i<unfix;i++){
        if(array[i]>array[i+1]){
          var temp = array[i];
          array.splice(i,1,array[i+1]);
          array.splice(i+1,1,temp);
        }
      }
    }
  }
