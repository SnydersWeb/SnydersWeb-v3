/*
	All scripts and graphics on this web site (c) 2005 David Snyder 
*/

function CreateTopicBar(topicBarItem) {
	var topicBarContainer = document.createElement("div");

	//Bar Properties - need to comb through the XML to find these properties.
	topicBarContainer.id = String(topicBarItem.id);
	topicBarContainer.contentLink = topicBarItem.getElementsByTagName("a")[0].getAttribute("href");
	topicBarContainer.startLeft = UNSEL_BAR_LEFT;
	topicBarContainer.startTop = UNSEL_BAR_TOP_START + ((parseInt(String(topicBarItem.id).replace(/\D/gi,"")) - 1) * (UNSEL_BAR_HEIGHT + UNSEL_BAR_SPACER));
	topicBarContainer.startWidth = UNSEL_BAR_WIDTH;
	topicBarContainer.startHeight = UNSEL_BAR_HEIGHT;
	topicBarContainer.step = 0;
	topicBarContainer.timeOut = 0;
	if(topicBarItem.parentNode.id == "selectedBar") {
		topicBarContainer.selected = true;
	} else {
		topicBarContainer.selected = false;
	}

	//Methods
	topicBarContainer.Promote = TopicBarPromote;
	topicBarContainer.Return = TopicBarReturn;
	
	with(topicBarContainer) {
		//Hide at first
		style.display = SHOW;
		style.visibility = "hidden";
		style.position = "absolute";		
				
		topicBar = appendChild(document.createElement("div"));
		topicBar.top = topicBar.appendChild(document.createElement("div"));
		topicBar.body = topicBar.appendChild(document.createElement("div"));
		topicBar.bottom = topicBar.appendChild(document.createElement("div"));
		
		//EventHandlers - cannot be assigned in With Block.
		topicBar.onclick = TopicBarLink; //function(){ alert("hi") };
		topicBar.onmouseover = TopicBarMouseOver; //function(){ alert("hi") };
		topicBar.onmouseout = TopicBarMouseOut; //function(){ alert("hi") };
		
		with(topicBar) {
			className = "topicBar";
			//Inner Bar Stuff
			with(top) {
				className = "topicBarTop";
				left = appendChild(document.createElement("div"));
				middle = appendChild(document.createElement("div"));
				right = appendChild(document.createElement("div"));
				
				//Set Styles			
				left.className = "topicBarTopLeft";
				middle.className = "topicBarTopMiddle";
				right.className = "topicBarTopRight";
				
				//Set Content
				middle.innerHTML = "<img src=\"" + siteRoot + "interfaceImages/spacer.gif\" width=\"1\" height=\"1\" alt=\"\" />";
			}
			
			with(body) {
				className = "topicBarBody";
				left = appendChild(document.createElement("div"));
				middle = appendChild(document.createElement("div"));
				right = appendChild(document.createElement("div"));

				//Set Styles			
				left.className = "topicBarBodyLeft";
				middle.className = "topicBarBodyMiddle";
				right.className = "topicBarBodyRight";
				
				//Set Content
				left.innerHTML = "<img src=\"" + siteRoot + "interfaceImages/spacer.gif\" width=\"1\" height=\"1\" alt=\"\" />";
				middle.barText = middle.appendChild(document.createElement("div"));
				middle.barText.className = "barText";
				middle.barText.innerHTML = topicBarItem.getElementsByTagName("a")[0].innerHTML;
				right.innerHTML = "<img src=\"" + siteRoot + "interfaceImages/spacer.gif\" width=\"1\" height=\"1\" alt=\"\" />";
			}
			
			with(bottom) {
				className = "topicBarBottom";
				left = appendChild(document.createElement("div"));
				drop = appendChild(document.createElement("div"));
				dropBottom = appendChild(document.createElement("div"));
				dropTrans = appendChild(document.createElement("div"));
				extender = appendChild(document.createElement("div"));
				right = appendChild(document.createElement("div"));
				
				//Set Styles
				left.className = "topicBarBottomLeft";
				drop.className = "drop";
				dropBottom.className = "dropBottom";
				dropTrans.className = "dropTrans";
				extender.className = "extender";
				right.className = "topicBarBottomRight";
				
				//Set Content
				drop.innerHTML = "<img src=\"" + siteRoot + "interfaceImages/spacer.gif\" width=\"1\" height=\"1\" alt=\"\" />";
				dropBottom.innerHTML = "<img src=\"" + siteRoot + "interfaceImages/spacer.gif\" width=\"1\" height=\"1\" alt=\"\" />";
				extender.innerHTML = "<img src=\"" + siteRoot + "interfaceImages/spacer.gif\" width=\"1\" height=\"1\" alt=\"\" />";
			}
		}
	}

	return topicBarContainer;
}

//This is part of the initialzation process - it converts the xhtml topicBars into dhtml objects.
function GetTopicBars() { 
	topicBarItem = true;
	
	for(var i = 1; topicBarItem; i++) {
		topicBarItem = document.getElementById("topicBar" + i);
		if(topicBarItem) {
			aryTopicBars.push(CreateTopicBar(RemoveBadNodes(topicBarItem)));
			
			//If the bar is selected - look for some extra attributes.
			if(aryTopicBars[i - 1].selected) {
			
				//Append SubTopics
				if(GetSubTopics(RemoveBadNodes(topicBarItem.childNodes[1]).childNodes[1])) { //Only has childnodes if it has anything.
					aryTopicBars[i - 1].subTopic = aryTopicBars[i - 1].appendChild(GetSubTopics(RemoveBadNodes(topicBarItem.childNodes[1]).childNodes[1]));
				}
				
				//Create, delete, and append SubMenu
				if(document.getElementById("subBody")) {
					var subMenu = SubMenuCreate(document.getElementById("subBody"));
					
					//Delete subMenu source
					for(var j = 0; j < topicBarItem.parentNode.childNodes.length; j++) {
						if(topicBarItem.parentNode.childNodes[j].id == "subMenu") {
							topicBarItem.parentNode.removeChild(topicBarItem.parentNode.childNodes[j]);
						}
					}
				
					//Append SubMenu
					aryTopicBars[i - 1].subMenu = aryTopicBars[i - 1].appendChild(subMenu);
				}
			}
		} else {
			break;
		}
	}

	//Kill Old Bars
	for(var i = 0; i < document.getElementById("circuitBG").childNodes.length; i++) {
		if(document.getElementById("circuitBG").childNodes[i].id == "unSelectedBarArea" || document.getElementById("circuitBG").childNodes[i].id == "selectedBar")
			document.getElementById("circuitBG").removeChild(document.getElementById("circuitBG").childNodes[i]);
	}
}

//Link Handler for topic Bar.
function TopicBarLink(e) {
	if(this.addEventListener) { //Mozilla
		e.cancelBubble = true;
	} else {  //IE
		event.cancelBubble = false;
	}
	FetchContent(this.parentNode.contentLink)
}

//SubTopic MouseOverHandlers
function TopicBarMouseOver(e) {
	if(this.addEventListener) { //Mozilla
		e.cancelBubble = true;
	} else {  //IE
		event.cancelBubble = false;
		this.style.cursor = "hand";
	}
}

function TopicBarMouseOut(e) {
	if(this.addEventListener) { //Mozilla
		e.cancelBubble = true;
	} else {  //IE
		event.cancelBubble = false;
		this.style.cursor = "auto";
	}
}		

function TopicBarPromote() {
	if(promoteTopicBarObj.timeOut == 0) { //Only time 0 is when it is starting
		//alert("FirstSet");
		
		//Pull attributes from style
		promoteTopicBarObj.style.left = UNSEL_BAR_LEFT + "px";
		promoteTopicBarObj.style.top = parseInt(promoteTopicBarObj.style.top) + "px";
		promoteTopicBarObj.style.width = parseInt(promoteTopicBarObj.offsetWidth) + "px";
		promoteTopicBarObj.style.zIndex = 4;
		promoteTopicBarObj.className = "selectedBar";
		
		//Set Hot
    if(client.classChange)
		  promoteTopicBarObj.childNodes[0].className = "topicBarHot";
	}

	//alert("PromoteMove:\nLeft:" + promoteTopicBarObj.style.left + "\nWidth:" + promoteTopicBarObj.style.width + "\nTop:" + promoteTopicBarObj.style.top);
	if(parseInt(promoteTopicBarObj.style.left) < SEL_BAR_LEFT) {
		promoteTopicBarObj.style.left = parseInt(promoteTopicBarObj.style.left) + 1 + (SEL_BAR_LEFT - parseInt(promoteTopicBarObj.style.left)) / TOPICBAR_STEPS + "px";
	}
	if(parseInt(promoteTopicBarObj.offsetWidth) < SEL_BAR_WIDTH) {
		promoteTopicBarObj.style.width = parseInt(promoteTopicBarObj.style.width) + 1 + (SEL_BAR_WIDTH - parseInt(promoteTopicBarObj.style.width)) / TOPICBAR_STEPS + "px";
	}
	
	if(parseInt(promoteTopicBarObj.style.left) >= SEL_BAR_LEFT && parseInt(promoteTopicBarObj.offsetWidth) >= SEL_BAR_WIDTH) {
		if(parseInt(promoteTopicBarObj.style.top) > SEL_BAR_TOP) {
			promoteTopicBarObj.style.top = parseInt(promoteTopicBarObj.style.top) - (parseInt(promoteTopicBarObj.style.top) - SEL_BAR_TOP) / TOPICBAR_STEPS + "px";
		}
	}
	
	if((parseInt(promoteTopicBarObj.style.left) < SEL_BAR_LEFT) || (parseInt(promoteTopicBarObj.offsetWidth) < SEL_BAR_WIDTH) || (parseInt(promoteTopicBarObj.style.top) > SEL_BAR_TOP)) {
		promoteTopicBarObj.timeOut = setTimeout("TopicBarPromote()", TOPICBAR_SPEED);
	} else {
		//Restore default styles
		promoteTopicBarObj.timeOut = 0;
		if(client.classChange)
      promoteTopicBarObj.childNodes[0].className = "topicBar";
		promoteTopicBarObj.style.width = "";
		//IE Tweak
		if(client.userAgent.search(/msie/) != -1 && client.appVersion < 7) { //Assuming MS will fix this POS in ver 7
			promoteTopicBarObj.style.width = SEL_BAR_WIDTH + "px";
		}		
		promoteTopicBarObj.style.top = SEL_BAR_TOP + "px";
		promoteTopicBarObj.style.left = SEL_BAR_LEFT + "px";
		promoteTopicBarObj.style.zIndex = 2;
		promoteTopicBarObj.className = "selectedBar";
		promoteTopicBarObj.selected = true;
	}
}

function TopicBarReturn() {
	if(returnTopicBarObj.timeOut == 0) { //Only time 0 is when it is starting
		//Pull attributes from style
		returnTopicBarObj.style.left = SEL_BAR_LEFT + "px";
		returnTopicBarObj.style.top = SEL_BAR_TOP + "px";
		returnTopicBarObj.style.width = parseInt(returnTopicBarObj.offsetWidth) + "px";
		
		//Now Kill style so object can be freely manipulated.
		returnTopicBarObj.className = "";
		
		//Set Hot
		if(client.classChange)
      returnTopicBarObj.childNodes[0].className = "topicBarHot";
	}
	
	//Phase 1 - slide back to the left
	if(parseInt(returnTopicBarObj.style.left) > returnTopicBarObj.startLeft) {
		//alert("LeftMove:\n" + returnTopicBarObj.style.left + "\n" + returnTopicBarObj.style.width + "\n" + returnTopicBarObj.step);
		returnTopicBarObj.style.left = parseInt(returnTopicBarObj.style.left) - (parseInt(returnTopicBarObj.style.left) - returnTopicBarObj.startLeft) / TOPICBAR_STEPS + "px";
		returnTopicBarObj.style.width = parseInt(returnTopicBarObj.style.width) - (parseInt(returnTopicBarObj.style.width) - UNSEL_BAR_WIDTH) / TOPICBAR_STEPS + "px";
	} else if(parseInt(returnTopicBarObj.style.top) < returnTopicBarObj.startTop) { //Phase 2 - drop it
		//alert("TopMove:\n" + returnTopicBarObj.startTop + " " + returnTopicBarObj.style.top + " " + (parseInt(returnTopicBarObj.style.top) + (returnTopicBarObj.startTop - parseInt(returnTopicBarObj.style.top)) / TOPICBAR_STEPS));
		returnTopicBarObj.style.top = parseInt(returnTopicBarObj.style.top) + 1 + (returnTopicBarObj.startTop - parseInt(returnTopicBarObj.style.top)) / TOPICBAR_STEPS + "px";
	}
	
	if((parseInt(returnTopicBarObj.style.left) != returnTopicBarObj.startLeft) || (parseInt(returnTopicBarObj.style.top) != returnTopicBarObj.startTop)) {
		returnTopicBarObj.timeOut = setTimeout("TopicBarReturn()", TOPICBAR_SPEED);
	} else {
		//Restore default styles
		returnTopicBarObj.timeOut = 0;
		if(client.classChange)
      returnTopicBarObj.childNodes[0].className = "topicBar";
		returnTopicBarObj.style.width = "";
		returnTopicBarObj.style.top = returnTopicBarObj.startTop + "px";
		returnTopicBarObj.style.left = returnTopicBarObj.startLeft + "px";
		returnTopicBarObj.className = "unSelectedBar";
		returnTopicBarObj.selected = false;
	}
}
