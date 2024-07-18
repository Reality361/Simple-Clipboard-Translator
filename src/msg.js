/**
 * 信息提醒，不依赖任何乱七八糟框架及其他文件，导入 msg.js ，msg.info('哈哈哈') 一句代码使用！
 * 作者：管雷鸣
 * 个人网站：www.guanleiming.com
 * 个人微信: xnx3com
 * 公司：潍坊雷鸣云网络科技有限公司
 * 公司官网：www.leimingyun.com
 */
var msg = {
	/*
	 * 当前msg的版本
	 */
	version:1.10,
	/*
	 * 错误的图
	 */
	errorIcon:'<svg style="width: 3rem; height:3rem; padding: 1.5rem; padding-bottom: 1.1rem; box-sizing: content-box;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6977"><path d="M696.832 326.656c-12.8-12.8-33.28-12.8-46.08 0L512 465.92 373.248 327.168c-12.8-12.8-33.28-12.8-46.08 0s-12.8 33.28 0 46.08L466.432 512l-139.264 139.264c-12.8 12.8-12.8 33.28 0 46.08s33.28 12.8 46.08 0L512 558.08l138.752 139.264c12.288 12.8 32.768 12.8 45.568 0.512l0.512-0.512c12.8-12.8 12.8-33.28 0-45.568L557.568 512l139.264-139.264c12.8-12.8 12.8-33.28 0-46.08 0 0.512 0 0 0 0zM512 51.2c-254.464 0-460.8 206.336-460.8 460.8s206.336 460.8 460.8 460.8 460.8-206.336 460.8-460.8-206.336-460.8-460.8-460.8z m280.064 740.864c-74.24 74.24-175.104 116.224-280.064 115.712-104.96 0-205.824-41.472-280.064-115.712S115.712 616.96 115.712 512s41.472-205.824 116.224-280.064C306.176 157.696 407.04 115.712 512 116.224c104.96 0 205.824 41.472 280.064 116.224 74.24 74.24 116.224 175.104 115.712 280.064 0.512 104.448-41.472 205.312-115.712 279.552z" fill="#ffffff" p-id="6978"></path></svg>',
	/*
	 * 当前弹出窗口显示的id。每次弹出窗口都会生成一个随机id
	 */
	currentWindowsId:0,	
	/*
	 * 弹出层的div id相关 
	 */
	id:{
		/*
		 * 弹出层 div id 的随机命名数组。这里存的是精确到毫秒的时间戳。 比如命名时会采用 wangmarket_loading + 此处id时间戳 的方式
		 */
		idArray	: new Array(),
		/*
		 * 从数组中增加一个值，这个值增加到数组最后，并将增加的值返回
		 */
		create:function(){
			//创建一个随机id
			var thisId = new Date().getTime()+'';
			//将随机id加入弹窗id序列
			msg.id.idArray[msg.id.idArray.length] = thisId;
			
			return thisId;
		},
		/*
		 * 从数组中删除值。并将删除的值返回。
		 * id 要删除的value。如果不传入，那默认删除最后一个
		 */
		delete:function(id = ''){
			var thisId = '';
			if(id == ''){
				//取出数组最后一个值
				thisId = msg.id.idArray[msg.id.idArray.length-1];
				//删除数组最后一个值
				msg.id.idArray.pop();
			}else{
				thisId = id;
				
				//删除指定的id
				for(var i = 0; i<msg.id.idArray.length; i++){ 
					if(msg.id.idArray[i] == id){
						msg.id.idArray.splice(i,1);	//删除这个元素
						return id; 
					}
				}
			}
			
			return thisId;
		},
		/*
		 * 这里就只是单纯存放 info\success\failure 这三个，免得同时点了几个后不自动取消的bug
		 */
		tishiIdArray: new Array()
	},
	
	/**
	 * 成功的提醒
	 * @param text 提示文字
	 * @param func 关闭提示后，要执行的方法
	 */
	success:function(text,func){
		this.closeAllSimpleMsg();
		
		var thisId = this.show(text, '<svg style="width: 3rem; height:3rem; padding: 1.5rem; padding-bottom: 1.1rem; box-sizing: content-box;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2351"><path d="M384 887.456L25.6 529.056 145.056 409.6 384 648.544 878.944 153.6 998.4 273.056z" p-id="2352" fill="#ffffff"></path></svg>');
		msg.id.tishiIdArray[msg.id.tishiIdArray.length] = thisId;
		this.delayClose(1800, func, thisId);
		return thisId;
	},

	/**
	 * 获取元素距离body距离
	 * @param {*} element 
	 * @returns 
	 */
	getElementDistanceToTop: function (element) {
		var rect = element.getBoundingClientRect();
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return rect.top + scrollTop;
	},

	/**
	 * 显示tips提示窗口
	 * @param options 参数(id、text、tip宽度、高度、背景色、字体色、显示方向direction)
	 * @return 返回弹出层的id。可以使用 msg.close(id) 来关闭指定的弹出层
	 */
	showTips:function(options){
		// 获取元素
		var dom = document.getElementById(options.id);

		var rect=dom.getBoundingClientRect()
		// console.log(rect)

		// 获取元素距离上方的距离
		var topDistance=this.getElementDistanceToTop(dom)
		// 获取元素距离左侧的距离
			, leftDistance =rect.x
		// 获取元素宽度
		,widthDom = dom.offsetWidth
		// 获取元素高度
		,heightDom = dom.offsetHeight
		// 获取视口的高度和宽度
		,windowHeight = window.innerHeight
		,windowWidth = window.innerWidth
		// 计算元素距离下方的距离
		,bottomDistance = windowHeight - topDistance - dom.offsetHeight
		// 计算元素距离右侧的距离
		,rightDistance = windowWidth - leftDistance - widthDom;

		// console.log("距离上方的距离：" + topDistance);
		// console.log("距离下方的距离：" + bottomDistance);
		// console.log("距离左侧的距离：" + leftDistance);
		// console.log("距离右侧的距离：" + rightDistance);

		// 提示框离内容的距离
		const specd="20px"
		// 默认背景色#10a6a8
		// const bg_color="rgba(46, 196, 182, 0.75)";
		,background="#10a6a8"
		// 默认颜色
		,color="#FFFFFF"
		// 默认宽度
		,width="200px"
		// 默认高度
		,height="auto"
		//默认方向
		,direction="right";

		if(!options.background) options.background=background;
		if(!options.color) options.color=color;
		if(!options.width) options.width=width;
		if(!options.height) options.height=height;
		if(!options.direction) options.direction=direction;

		// console.log(options)

		if(options.direction!=="left" && options.direction!=="right"&&options.direction!=="top"&&options.direction!=="bottom") return console.log("请输入正确的tips方向")
	
		//创建一个随机id
		var thisId = msg.id.create();
		
		/** 显示前，如果还有其他正在显示的，将其都关掉 **/
		//this.close();
		if(document.getElementsByTagName("body") != null && document.getElementsByTagName("body").length > 0 && dom instanceof Element){
			var div=document.createElement("div");
			div.id = 'wangmarket_popup_'+thisId;

			div.style = `position:absolute;padding:10px;border-radius:2px;
				${options.direction == "left" || options.direction == "right" ? `top: ${topDistance}px;`:""}
				${options.direction == "left" ? `right: calc(${rightDistance}px + ${widthDom}px + ${parseInt(specd)/2}px);`:""}
				${options.direction == "right" ? `left: calc(${leftDistance}px + ${widthDom}px + ${parseInt(specd) / 2}px);`:""}

				${options.direction == "top" || options.direction == "bottom" ? `left:${leftDistance}px;`:""}
				${options.direction == "top" ? `bottom: calc(${bottomDistance}px + ${heightDom}px + ${parseInt(specd) / 2}px);`:""}
				${options.direction == "bottom" ? `top: calc(${topDistance}px + ${heightDom}px + ${parseInt(specd) / 2}px);`:""}
				background:${options.background};
				z-index: 2147483647;width: ${options.width};
				box-shadow: 0px 3px 10px 0px rgba(143, 140, 140, 0.31);
				height:${options.height};box-sizing:border-box`;

			// 添加一个初始样式，使创建的元素在初始时缩放为0
			div.style.transform = "scale(0.8)";
			// 添加过渡效果
			div.style.transition = "transform 0.1s ease-in-out";
			div.innerHTML = ''
				+ `<div id="tip" style="font-size:12px;line-height:18px;text-align:left;color:${options.color};white-space: initial">`+
				options.text
				+'</div>';

			div.classList.add('_custom_deng');
			var pseudoElementStyle = `
				content: " ";
			    position: absolute;
				${options.direction=="left"||options.direction=="right"?"top: 13px;":""}
				${options.direction=="top"||options.direction=="bottom"?"left: 10%;":""}
			    ${options.direction}: 100%;
			    border: ${parseInt(specd)/4}px solid transparent;
				border-${options.direction}: ${parseInt(specd)/2}px solid ${options.background};
			`;
			// console.log(this.flag)
			var existingStyle = document.getElementById("_custom_deng_style");

			if (!existingStyle) {
				var styleSheet = document.createElement("style");
				styleSheet.type = "text/css";
				styleSheet.id = "_custom_deng_style";
				styleSheet.innerText = `._custom_deng::before { ${pseudoElementStyle} }`;
				document.head.appendChild(styleSheet);
			} else {
				existingStyle.innerText = `._custom_deng::before { ${pseudoElementStyle} }`;
			}
	
			// 触发缩放动画效果
			setTimeout(function () {
				div.style.transform = "scale(1)"; // 缩放为1，显示动画效果
			}, 10);

			document.body.appendChild(div);
			
		}else{
			alert('提示，body中没有子元素，无法显示 msg.js 的提示');
		}
		// 触发动画
		return thisId;
	},


	/**
	 * 鼠标跟随提示
	 * @param options 弹出层的其他属性。传入如： 
	 * 		<pre>
	 * 			{
	 * 				id:'元素属性id值'。   //要显示文字提示的元素属性id。	****必传项****
	 * 				text:'提示的文字内容',	//显示的内容，支持html。		****必传项****
	 * 				direction:'right',	//弹出层要显示的方位。不传默认 right。传入如 left、right、top、bottom。
	 *				height:'auto',		//弹出层显示的高度。不传默认是 auto。 传入如 100px 、 10rem 等。不能使用%百分比。
	 *				width:'200px',		//弹出层显示的宽度。不传默认是 200px。传入如 100px 、 10rem 、 50% 等。
	 *				background:'#10a6a8'//背景颜色。十六进制颜色编码。不传默认是 '#10a6a8'
	 *				color:'#FFFFFF'		//字体颜色。十六进制颜色编码。不传默认是 '#FFFFFF'
	 *			}
	 * 		</pre>
	 * @return 返回弹出层的id。可以使用 msg.close(id) 来关闭指定的弹出层
	 */
	tip:function(options){
		if(!options||!options.id||!options.text) return console.log("msg.tip()方法中请传入基本的选项(包括id和显示文本)")
		var dom=document.getElementById(options.id)
		if(!dom) return
		var thisId
		//mouseover mouseout
		//mouseenter mouseleave 防止内部子元素触发
		dom.addEventListener("mouseenter",(event)=>{
			event.stopPropagation()
			this.closeAllSimpleMsg();
			thisId = this.showTips(options);
	  	msg.id.tishiIdArray[msg.id.tishiIdArray.length] = thisId;
		})
		dom.addEventListener("mouseleave",()=>{
			this.close(thisId)
		})
		return thisId;
	},


	/**
	 * 失败、错误的提醒
	 * @param text 提示文字
	 * @param func 关闭提示后，要执行的方法
	 */
	failure:function(text, func){
		this.closeAllSimpleMsg();
		
		var thisId = this.show(text, this.errorIcon);
		msg.id.tishiIdArray[msg.id.tishiIdArray.length] = thisId;
		this.delayClose(1800, func, thisId);
		return thisId;
	},
	/**
	 * 提示信息
	 * @param text 提示文字
	 * @param func 关闭提示后，要执行的方法
	 */
	info:function(text, func){
		this.closeAllSimpleMsg();
		
		var thisId = this.show(text, '<svg style="width: 3rem; height:3rem; padding: 1.5rem; padding-bottom: 1.1rem; box-sizing: content-box;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7996"><path d="M509.979 959.316c-247.308 0-447.794-200.486-447.794-447.794S262.671 63.728 509.979 63.728s447.794 200.486 447.794 447.794-200.485 447.794-447.794 447.794z m0-814.171c-202.346 0-366.377 164.031-366.377 366.377s164.031 366.377 366.377 366.377c202.342 0 366.377-164.031 366.377-366.377S712.321 145.145 509.979 145.145z m-40.708 610.628c-40.709 0-40.709-40.708-40.709-40.708l40.709-203.543s0-40.709-40.709-40.709c0 0-40.709 0-40.709-40.709h122.126s40.709 0 40.709 40.709-40.709 162.834-40.709 203.543 40.709 40.709 40.709 40.709h40.709c-0.001 0-0.001 40.708-122.126 40.708z m81.417-407.085c-22.483 0-40.709-18.225-40.709-40.709s18.225-40.709 40.709-40.709 40.709 18.225 40.709 40.709-18.226 40.709-40.709 40.709z" p-id="7997" fill="#ffffff"></path></svg>');
		msg.id.tishiIdArray[msg.id.tishiIdArray.length] = thisId;
		this.delayClose(1800, func, thisId);
		return thisId;
	},
	
	/**
	 * 关闭info、success、failure 这几个的所有提示消息
	 */
	closeAllSimpleMsg:function(){
		for(var i = 0; i<msg.id.tishiIdArray.length; i++){
			msg.close(msg.id.tishiIdArray[i]);
		}
	},
	
	/**
	 * 弹出询问选择框：确定、取消
	 */
	confirm:function(text){
		return confirm(text);
	},
	/**
	 * 加载中、等待中的动画效果
	 * @param text 提示文字
	 */
	loading:function(text){
		this.show(text, '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjlGOUY5Ij4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjMiIHI9IjAiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSIwOzM7MDswIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoNDUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjEyNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoOTAgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjI1cyIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSB0cmFuc2Zvcm09InJvdGF0ZSgxMzUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjM3NXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMTgwIDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC41cyIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSB0cmFuc2Zvcm09InJvdGF0ZSgyMjUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjYyNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMjcwIDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC43NXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMzE1IDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC44NzVzIiBrZXlTcGxpbmVzPSIwLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuOCIgY2FsY01vZGU9InNwbGluZSIgLz4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIHRyYW5zZm9ybT0icm90YXRlKDE4MCAxNiAxNikiIGN4PSIxNiIgY3k9IjMiIHI9IjAiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSIwOzM7MDswIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAuNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgo8L3N2Zz4K" style="width: 3rem; height:3rem; padding: 1.5rem; padding-bottom: 1.1rem; box-sizing: content-box;" />');
	},
	/**
	 * 关闭各种提示，包括加载中、成功、失败、提示信息等，都可以用此强制关闭
	 * id 弹出层的id。正常使用无需传入 。这里传入的是 msg.id.idArray 中的某个值
	 */
	close:function(id = ''){
		this.currentWindowsId = 0;	//当前没有任何窗口
		//取出数组的值
		var thisId = msg.id.delete(id);
		
		var loadingDiv = document.getElementById('wangmarket_popup_'+thisId);
		if(loadingDiv != null){
			var loadingDivParent = loadingDiv.parentNode;
			if(loadingDivParent != null){
				loadingDivParent.removeChild(loadingDiv);
			}
		}
		
		//关闭pupups相关
		//var popupsDiv = document.getElementById('wangmarket_popups')
		//if(popupsDiv != null){
		//	var popupsDivParent = popupsDiv.parentNode;
		//	if(popupsDivParent != null){
		//		popupsDivParent.removeChild(popupsDiv);
		//	}
		//}
	},
	/**
	 * 延迟几秒后关闭弹出提示
	 * @param time 延迟多长时间，单位是毫秒
	 * @param func 关闭提示后，要执行的方法
	 * @param id 弹出窗口的id
	 */
	delayClose: function(time, func, id=''){
		var cid = parseInt(Math.random()*100000);
		this.currentWindowsId = cid;
		var that = this;
		setTimeout(function(){
			if(that.currentWindowsId == cid){
				/* 能对应起来，才会关闭。避免关闭别的刚显示的窗口 */
				msg.close(id);
			}
			if(func != null){
				func();
			}
		},time);
	},
	/**
	 * 显示提示窗口，私有方法
	 * text 提示文字
	 * img 显示的图片或者svg
	 * @return 返回弹出层的id。可以使用 msg.close(id) 来关闭指定的弹出层
	 */
	show:function(text, img){
		/** 是否是横向显示 **/
		var wangmarket_loading_hengxiang = false;
		if(text != null && text.length > 10){
			wangmarket_loading_hengxiang = true;
		}
		
		//创建一个随机id
		var thisId = msg.id.create();
		
		/** 显示前，如果还有其他正在显示的，将其都关掉 **/
		//this.close();
		if(document.getElementsByTagName("body") != null && document.getElementsByTagName("body").length > 0){
			var div=document.createElement("div");
			div.id = 'wangmarket_popup_'+thisId;
			div.style = 'position: fixed;z-index: 2147483647;margin: 0 auto;text-align: center;width: 100%;';
			div.innerHTML = ''
				+'<div id="loading" style="position: fixed;top: 30%;text-align: center;font-size: 1rem;color: #dedede;margin: 0px auto;left: 50%;margin-left: -'+(wangmarket_loading_hengxiang? '9':'3.5')+'rem;">'
				+'<div style="width: 7rem;background-color: #2e2d3c;border-radius: 0.3rem; filter: alpha(Opacity=80); -moz-opacity: 0.8; opacity: 0.8; min-height: 4.8rem;'+(wangmarket_loading_hengxiang? 'width: 18rem;':'')+'">'
				+'<div'+(wangmarket_loading_hengxiang? ' style="float:left;height: 20rem; margin-top: -0.6rem; position: fixed;"':'')+'>'+img+'</div>'
				+'<div style="width: 100%;padding-bottom: 1.4rem; font-size: 1.1rem; padding-left: 0.3rem;padding-right: 0.3rem; box-sizing: border-box;line-height: 1.2rem;color: white;'+(wangmarket_loading_hengxiang? 'padding: 1rem; text-align: left; padding-right: 0.3rem; line-height: 1.5rem;margin-left: 4.8rem; padding-right: 5.5rem; padding-top: 0.7rem;':'')+'">'+text+'</div>'
				+'</div>';
				+'</div>';
			document.getElementsByTagName("body")[0].appendChild(div);
		}else{
			alert('提示，body中没有子元素，无法显示 msg.js 的提示');
		}
		
		return thisId;
	},
	/**
	 * 弹出层，弹出窗口
	 * @param attribute 弹出层的其他属性。传入如： 
	 * 		<pre>
	 * 			{
	 * 				text:'弹窗的内容',	//弹出窗显示的内容，支持html
	 * 				url:'https://www.leimingyun.com/index.html' //设置弹出窗口要打开的网址，如果url跟text同时设置，那么优先采用url， text设置将无效
	 *				top:'30%',			//弹出层距离顶部的距离，不传默认是30%。 可以传入如 30%、 5rem、 10px 等
	 *				left:'5%',			//弹出层距离浏览器左侧的距离，不传默认是5%
	 *				height:'100px',		//弹出层显示的高度。不传默认是 auto。 传入如 100px 、 10rem 等。不能使用%百分比。
	 *				width:'90%',		//弹出层显示的宽度。不传默认是 90%。传入如 100px 、 10rem 、 50% 等。
	 *				bottom:'1rem',		//弹出层距离底部的距离。不传默认是 auto 。 height 跟 bottom 如果这两个同时设置了，那么height生效，bottom是不生效的
	 *				close:false			//是否显示右上角的关闭按钮，不传默认是true，显示关闭按钮
	 *				background:'#2e2d3c'	//背景颜色。十六进制颜色编码。不传默认是 '#2e2d3c'
	 *				opacity:92			//弹出层的透明度，默认是92, 取值0~100，0是不透明，100是全部透明
	 *				padding:'10px'		//弹出层四周留的空隙，默认是1rem。可传入如 10px 、 1rem 等
	 *			}
	 * 		</pre>
	 * @return 返回弹出层的id。可以使用 msg.close(id) 来关闭指定的弹出层
	 */
	popups:function(attribute){
		var setLeftPosition = false; //是否设置了距离左侧距离
		var setTopPosition = false; //是否设置了距离顶部距离
		
		if(typeof(attribute) == 'undefined'){
			attribute = {};
		}else if(typeof(attribute) == 'string'){
			//直接传入了 string 格式的提示文本
			attribute = {text:attribute};
		}
		if(attribute == null){
			attribute = {}
		}
		
		if(attribute.left != null){
			setLeftPosition = true;
		}
		if(attribute.top != null || attribute.bottom != null){
			setTopPosition = true;
		}
		
		if(attribute.url != null){
			if(attribute.text != null){
				//友好提醒
				console.log('友好提醒：您已经设置了 attribute.url ，但是您又设置了 attribute.text ，根据优先级， 将采用 attribute.url ，而 attribute.text 设置无效。 ');
			}
			
			var suiji_load_id = 'msg_popups_loading_'+new Date().getTime();
			attribute.text = '<iframe src="'+attribute.url+'" frameborder="0" style="width:100%;height:100%; display:none;" onload="document.getElementById(\''+suiji_load_id+'\').style.display=\'none\'; this.style.display=\'\';"></iframe><div id="'+suiji_load_id+'" style="width: 100%; height: 100%; text-align: center; padding-top: 30%; font-size: 1.4rem; box-sizing: border-box; overflow: hidden; ">加载中...</div>';
		}
		
		//如果text为空，那么提示一下
		if(attribute.text == null){
			attribute.text = '您未设置text的值，所以这里出现提醒文字。您可以这样用: <pre>msg.popups(\'我是提示文字\');</pre>';
		}
		//判断一下 height 跟 bottom 是否同时设置了，因为如果这两个同时设置了，bottom是不生效的
		if(attribute.height != null && attribute.bottom != null){
			console.log('msg.js -- function popups() : 友情提示:您同时设置了height、bottom两个属性，此时height属性生效，bottom属性将会不起作用');
		}
		
		//赋予默认属性
		if(attribute.close == null){
			attribute.close = true;
		}
		if(attribute.top == null){
			attribute.top = 'auto';
		}
		if(attribute.bottom == null || attribute.bottom.length < 1){
			attribute.bottom = 'auto';
		}
		if(attribute.background == null){
			attribute.background = '#2e2d3c';
		}
		if(attribute.opacity == null){
			attribute.opacity = 92;
		}
		if(attribute.height == null){
			attribute.height = 'auto';
		}
		if(attribute.left == null){
			attribute.left = '5%';
		}
		if(attribute.width == null){
			attribute.width = '90%';
		}
		if(attribute.padding == null){
			attribute.padding = '1rem';
		}
		
		//创建一个随机id
		var thisId = msg.id.create();
		
		var div=document.createElement("div");
		//div.id = 'wangmarket_popups';
		div.id = 'wangmarket_popup_'+thisId;
		div.style = 'position: fixed; z-index: 2147483647; margin: 0px auto; text-align: center; width: 100%; ';
		div.innerHTML = '<div style="position: fixed; top:'+attribute.top+'; bottom:'+attribute.bottom+'; text-align: center;font-size: 1rem;color: #dedede;margin: 0px auto;width: '+attribute.width+';left: '+attribute.left+'; height: '+attribute.height+'; overflow-y: initial; overflow-x: initial;">'+
							'<div style="padding:0rem">'+
								'<div style="width: 100%;background-color: '+attribute.background+';border-radius: 0.3rem;filter: alpha(Opacity='+attribute.opacity+');-moz-opacity: '+(attribute.opacity/100)+';opacity: '+(attribute.opacity/100)+';min-height: 4.8rem; height: 100%;">'+
									'<div style=" width: 100%; font-size: 1rem; box-sizing: border-box; line-height: 1.3rem; color: white; text-align: left; padding: '+attribute.padding+'; overflow-y: auto; height: '+attribute.height+'; display: flex; border-radius: 0.4rem;">'+
									attribute.text+
									'</div>'+
									(attribute.close? '<div class="msg_close" style="top: -0.8rem;position: absolute;right: -0.6rem;background-color: aliceblue;border-radius: 50%;height: 2rem;width: 2rem; z-index: 2147483647;" onclick="msg.close('+thisId+');"><svg style="width: 2rem; height:2rem; cursor: pointer;" t="1601801323865" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4482" width="48" height="48"><path d="M512.001 15.678C237.414 15.678 14.82 238.273 14.82 512.86S237.414 1010.04 512 1010.04s497.18-222.593 497.18-497.18S786.589 15.678 512.002 15.678z m213.211 645.937c17.798 17.803 17.798 46.657 0 64.456-17.798 17.797-46.658 17.797-64.456 0L512.001 577.315 363.241 726.07c-17.799 17.797-46.652 17.797-64.45 0-17.804-17.799-17.804-46.653 0-64.456L447.545 512.86 298.79 364.104c-17.803-17.798-17.803-46.657 0-64.455 17.799-17.798 46.652-17.798 64.45 0l148.761 148.755 148.755-148.755c17.798-17.798 46.658-17.798 64.456 0 17.798 17.798 17.798 46.657 0 64.455L576.456 512.86l148.756 148.755z m0 0" fill="'+attribute.background+'" p-id="4483"></path></svg></div>':'')+
								'</div>'+
							'</div>'+
						'</div>';
		
		//<div style="width: 100%;padding-bottom: 1rem;font-size: 1.1rem;padding-left: 0.3rem;padding-right: 2.0rem;box-sizing: border-box;line-height: 1.2rem;color: white;text-align: right;"> <button style=" border: aliceblue; padding: 0.4rem; padding-left: 1rem; padding-right: 1rem; font-size: 0.8rem; background-color: darkcyan; " onclick="close1();">确定</button> </div>
		if(document.getElementsByTagName("body") != null && document.getElementsByTagName("body").length > 0){
			document.getElementsByTagName("body")[0].appendChild(div);

			/** 计算位置，剧中显示 **/
			
			//弹窗位置控制元素
			//var msgPositionDom = document.getElementById('wangmarket_popups').firstChild;
			var msgPositionDom = document.getElementById('wangmarket_popup_'+thisId).firstChild;
			
			if(!setLeftPosition){
				//如果没有设置left，那么设置宽度居中
				try {
					var htmlWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;   	//html可见区域宽度
					var msgWidth = msgPositionDom.clientWidth||msgPositionDom.offsetWidth; //当前弹窗的宽度
					msgPositionDom.style.left = ((htmlWidth - msgWidth)/2) + 'px';
				} catch (e) {
					console.log(e);
				}
			}
			if(!setTopPosition){
				//如果没有设置top、bottom，那么设置高度居中
				try {
					var htmlHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;   	//html可见区域高度
					var msgHeight = msgPositionDom.clientHeight||msgPositionDom.offsetHeight; //当前弹窗的高度
					if(msgHeight > htmlHeight){
						//如果弹窗高度比body还高，那么直接就显示到顶部
						msgPositionDom.style.top = '20px';
					}else{
						msgPositionDom.style.top = ((htmlHeight - msgHeight)/2) + 'px';
					}
				} catch (e) {
					console.log(e);
				}
			}
		}else{
			alert('提示，body中没有子元素，无法显示 msg.js 的提示');
			return;
		}
		
		return thisId;
	},
	/**
	 * 确认弹出提示
	 * @param attribute 弹出层的其他属性。传入如： 
	 * 		<pre>
	 * 			{
	 * 				text:'弹窗的内容',	//弹出窗显示的内容，支持html
	 *				width:'17rem',		//弹出层显示的宽度。不传默认是 17rem。传入如 100px 、 17rem 、 50% 等。
	 *				close:false			//是否显示右上角的关闭按钮，不传默认是false，不显示关闭按钮
	 *				background:'#2e2d3c'	//背景颜色。十六进制颜色编码。不传默认是 '#2e2d3c'
	 *				opacity:92,			//弹出层的透明度，默认是92, 取值0~100，0是不透明，100是全部透明
	 *				padding:'10px',		//弹出层四周留的空隙，默认是1rem。可传入如 10px 、 1rem 等
	 *				buttons:{
	 *					'确定':function(){
	 *						console.log('点击了确定');
	 *					},
	 *					'取消':function(){
	 *						console.log('点击了取消');
	 *					}
	 *				},
	 *				buttonStyle:'padding-left:0.6rem; padding-right:0.6rem; font-size: 0.9rem;'		//弹出的confirm右下角的几个按钮的样式，会直接加到 <button style="....这里"  不传入默认则是padding-left:0.6rem; padding-right:0.6rem; font-size: 0.9rem;  
	 *			}
	 * 		</pre>
	 *  @param okFunc 如果上面attribute使用的是最简单使用方式，attribute传入的是 text显示的内容，那么这里就是点了确定按钮后执行的方法
	 */
	confirm:function(attribute, okFunc){
		//这里存在一种最简单的弹出方式，直接传入提示内容跟点击确定后执行的方法，所以要在前面判断一下
		if(typeof(attribute) == 'string'){
			//attribute 是 confirm弹出的内容
			
			attribute = {text:attribute}
			attribute.buttons = {
				'确定':okFunc,
				'取消':function(){}
			}
		}
		
		if(attribute.buttonStyle == null){
			attribute.buttonStyle = 'padding-left:0.6rem; padding-right:0.6rem; font-size: 0.9rem;';
		}
		
		//如果text为空，那么提示一下
		if(attribute.text == null){
			attribute.text = '您未设置text的值，所以这里出现提醒文字。您可以这样用: <pre>msg.popups(\'我是提示文字\');</pre>';
		}else{
			
			if(attribute.buttons == null){
				attribute.text = '您还未设置 buttons 属性';
			}
			//统计自定义了几个button
			var i = 0;
			for(let key in attribute.buttons){
				i++;
			}
			//取出button来
			var buttonsHtml = '';	//button显示的html
			for(let key in attribute.buttons){
				i--;
				//新取一个函数名
				var name = ''+key+'_'+new Date().getTime();
				window.msg.confirm[name] = function(){ msg.close(); attribute.buttons[key](); };
				buttonsHtml = buttonsHtml+'<button onclick="window.msg.confirm[\''+name+'\']();" style="'+attribute.buttonStyle+'">'+key+'</button>'+(i>0? '&nbsp;&nbsp;':'');
			}
			
			attribute.text = '<div style="line-height: 1.4rem; width:100%; padding-right: 0.2rem;">'+attribute.text+'<div style=" display: inherit; width: 100%; text-align: right;margin-top: 1rem;">'+buttonsHtml+'</div></div>';
		}
		
		//赋予默认属性
		if(attribute.close == null){
			attribute.close = false;
		}
		if(attribute.width == null){
			attribute.width = '17rem';
		}
		
		
		return msg.popups(attribute);
	},
	//需要确认的弹出提示，替代js原本的alert弹窗
	alert:function(text){
		return msg.confirm({
		    text:text,
		    buttons:{
		        确定:function(){}
		    } 
		});
	},
	
	/**
	 * 弹出 input 输入框
	 * text 提示文字,必填
	 * okFunc 点击了确定按钮执行的方法。,必填， 这里传入 function(value){ //这里拿到的value 就是用户自己输入的 }
	 * defaultValue 输入框中的默认值，非必填，如果不传此参数，那输入框中默认就是没有任何值 
	 * isTextarea 是否是textarea输入框，默认是false，不是，只是单纯的input输入框。这个参数默认不用传入。
	 */
	input:function(text, okFunc, defaultValue, isTextarea=false){
		if(typeof(okFunc) == 'undefined' || okFunc == null){
			msg.failure('请传入点击确定按钮要执行的方法');
			return;
		}
		
		if(typeof(defaultValue) == 'undefined' || defaultValue == null){
			defaultValue = '';
		}
		
		//默认是input
		var inputHTML = '<input type="text" id="msg_input_id" style="width: 100%; line-height: 1.6rem; margin-right: 1rem; box-sizing: border-box;" value="'+defaultValue+'" >';
		if(isTextarea){
			//textarea输入框
			inputHTML = '<textarea rows="3" id="msg_input_id" style="width: 100%; line-height: 1.3rem; margin-right: 1rem; box-sizing: border-box;">'+defaultValue+'</textarea>';
		}
		
		var enterButtonId = 'msg_input_enterButtonId_'+new Date().getTime();	//确认按钮的id
		var text = ''+
			'<div style="width: 100%;">'+
				'<div style=" padding-bottom: 0.8rem; font-size: 1.2rem; line-height: 1.7rem;">'+text+'</div>'+
				'<div>'+inputHTML+'</div>'+
				'<div style=" display: inherit; width: 100%; text-align: right;margin-top: 1rem;"><button id='+enterButtonId+' style="padding-left:0.8rem; padding-right:0.8rem; font-size: 1rem;">确定</button></div>'+
			'</div>';
		var thisId = msg.popups({
		    text:text,
		    width:'20rem'
		});
		var enter = document.getElementById(enterButtonId);
		enter.onclick = function(){
			var msg_input_value = document.getElementById('msg_input_id').value; 
			msg.close();
			okFunc(msg_input_value); 
		}
		
		return thisId;
	},
	
	/**
	 * 弹出 textarea 输入框
	 * text 提示文字,必填
	 * okFunc 点击了确定按钮执行的方法。,必填， 这里传入 function(value){ //这里拿到的value 就是用户自己输入的 }
	 * defaultValue 输入框中的默认值，非必填，如果不传此参数，那输入框中默认就是没有任何值 
	 */
	textarea:function(text, okFunc, defaultValue){
		return msg.input(text, okFunc, defaultValue, true);
	}
	
}