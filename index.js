var navRender=(function(){
	var $menu=$('#menu')
	var	$nav=$('nav')
	var bOk=false
	return {
		init:function(){
			$menu.tap(function(){
				console.log(bOk)
				if(bOk){
					$nav.css({
						padding:'0',
						height:'0'
					})
					bOk=false
					return
				}
				$nav.css({
					padding:'.1rem 0',
					height:'2.22rem'
				})
				bOk=true
			})
		}
	}
}())
navRender.init()
//
var matchRender=(function(){
	
	return {
		init:function(){
			
			matchRender.bind()
			
		},
		bind:function(){
			$.ajax({
				url:'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1469151',
				type:'get',
				dataType:'jsonp',
				success:function(result){
					if(result&&result[0]==0){
						var data=result[1]
						var matchInfo=data.matchInfo
						matchInfo.leftSup=data.leftSupport
						matchInfo.rightSup=data.rightSupport
						matchRender.bindMatch(matchInfo)
						matchRender.bindEvent()
					}
				}
			})
			
			$.ajax({
				url:'http://matchweb.sports.qq.com/html/matchStatV37?mid=100000:1469151',
				type:'get',
				dataType:'jsonp',
				success:function(result){
					if(result&&result[0]==0){
						result=result[1]
						var playInfo=result.stats[0].list
						matchRender.bindPlay(playInfo)
					}
				}
			})
		},
		bindMatch:function(matchInfo){
			var template=$('#matchTemplate').html()
			var res=ejs.render(template,{matchInfo:matchInfo})
			$('.match').html(res)
		},
		bindPlay:function(playInfo){
			var template=$('#playTemplate').html()
			var res=ejs.render(template,{playInfo:playInfo})
			$('.swiper').html(res).css('width',2.4*playInfo.length+'rem')
			new IScroll('.player',{
				scrollbars:true,
				scrollY:false,
				scrollX:true
			})
		},
		bindEvent:function(){
			var b=false
			var type
			var local=localStorage.getItem('sup')
			if(local){
				var $spanL=$('.proLeft')
				var $spanR=$('.proRight').children('img')
				//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、路径
				//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
				local=='1'?$('.proLeft').css('color','red').children('img').attr('src','./img/support-red.png'):$('.proRight').css('color','blue').children('img').attr('src','./img/support-blue.png')
				return
			}
			$('.proLeft').tap(function(e){
				if(b)return
				var $sup=$(this).children('span')
				var n=$sup.html()
				n++
				$sup.html(n)
				b=true
				type=$(this).attr('type')
				$('.proLeft').css('color','red').children('img').attr('src','./img/support-red.png')
				post_locl()
			})
			$('.proRight').tap(function(e){
				if(b)return
				var $sup=$(this).children('span')
				var n=$sup.html()
				n++
				$sup.html(n)
				b=true
				type=$(this).attr('type')
				post_locl()
				$('.proRight').css('color','blue').children('img').attr('src','./img/support-blue.png')
			})
			function post_locl(){
					$.ajax({
						type:"post",
						url:"http://matchweb.sports.qq.com/kbs/teamSupport?mid=100000:1469151&type="+type,
						dataType:'jsonp'
					});
					localStorage.setItem('sup',type)
				}
		}
	}
})()
matchRender.init()
//