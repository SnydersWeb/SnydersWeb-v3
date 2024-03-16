/*
	All scripts and graphics on this web site (c) 2007 David Snyder 
*/

function SubMenuCreate(subMenuSource) {
	var subMenu = document.createElement("div");
	
	subMenu.timeOut = 0;
	subMenu.expanded = false;
	
	//DHTML Version "Rolls Up", adjust style
	subMenu.style.right = SUBMENU_RIGHT + "px";

	subMenu.nub = subMenu.appendChild(document.createElement("div"));
	subMenu.subPulldown = subMenu.appendChild(document.createElement("div"));
	subMenu.subPulldown.subBody = subMenu.subPulldown.appendChild(document.createElement("div"));
	subMenu.subPulldown.subBottom = subMenu.subPulldown.appendChild(document.createElement("div"));
	
	//Set Timeout used for animations
	subMenu.subPulldown.timeOut = 0;
	subMenu.subPulldown.topClip = 0;
	
	//Event Handlers - Commented out in the create phase to keep it from being prematurely triggered.
	subMenu.onmouseover = SubMenuMouseOver;
	subMenu.onmouseout = SubMenuMouseOut;

	//Methods
	subMenu.Promote = SubMenuAdd;
	subMenu.Remove = SubMenuRemove;

	with(subMenu) {
		id = "subMenu";
		
		//Create Inner Nub Stuff - GRRR - have to put this out here since MSIE is a POS and must DIE!
		nub.nubLeft = nub.appendChild(document.createElement("div"));
		nub.nubBody = nub.appendChild(document.createElement("div"));
		nub.nubRight = nub.appendChild(document.createElement("div"));
		
		with(nub) {
			id = "nub";
						
			//Assign Id's
			nubLeft.id = "nubLeft";
			nubBody.id = "nubBody";
			nubRight.id = "nubRight";
			
			//Set Contents
			nubBody.innerHTML = "Sub Menu";
		}

		with(subPulldown) {
			id = "subPulldown";

			//set styles
			style.display = HIDE; 
			style.visibility = "hidden";
				
			with(subBody) {
				id = "subBody";
				
				if(subMenuSource.xml) { //IE Request through XML
					//Create SubItems
					for(var i = 0; i < subMenuSource.getElementsByTagName("a").length; i++) {
						subItem = appendChild(document.createElement("div"));
						subItem.className = "subMenuItem";
						//Text
						subItem.innerHTML = subMenuSource.getElementsByTagName("a")[i].text;
						//Link
						subItem.contentLink = subMenuSource.getElementsByTagName("a")[i].getAttribute("href");
						//Event Handler
						subItem.onclick = SubMenuLink;
					}
				} else { //Mozilla and IE as it parses in the document onload
					//Create SubItems
					for(var i = 0; i < subMenuSource.getElementsByTagName("a").length; i++) {
						subItem = appendChild(document.createElement("div"));
						subItem.className = "subMenuItem";
						//Text
						subItem.innerHTML = subMenuSource.getElementsByTagName("a")[i].innerHTML;
						//Link
						subItem.contentLink = subMenuSource.getElementsByTagName("a")[i].getAttribute("href");
						//Event Handler
						subItem.onclick = SubMenuLink;
					}
				}
			}
	
			//Create Bottom Stuff - Again IE is a Major POS!
			subBottom.subBotLeft = subBottom.appendChild(document.createElement("div"));
			subBottom.subBotMiddle = subBottom.appendChild(document.createElement("div"));
			subBottom.subBotRight = subBottom.appendChild(document.createElement("div"));
				
			with(subBottom) {
				id = "subBottom";
				
				//Assign Id's
				subBotLeft.id = "subBotLeft";
				subBotMiddle.id = "subBotMiddle";
				subBotRight.id = "subBotRight";

				//Set Contents
				subBotMiddle.innerHTML = "<img src=\"" + siteRoot + "interfaceImages/spacer.gif\" width=\"1\" height=\"1\" alt=\"\" />";
	
			}
		}			
	}
	
	return subMenu;
} 

//SubMenu Link Handler
function SubMenuLink(e) {
	if(this.addEventListener) { //Mozilla
		e.cancelBubble = true;
	} else {  //IE
		event.cancelBubble = false;
	}
	
	//alert("Sub:" + this.contentLink);
	FetchContent(this.contentLink)
}

//SubMenu MouseOverHandlers
function SubMenuMouseOver(e) {
	if(this.addEventListener) { //Mozilla
		e.cancelBubble = true;
	} else {  //IE
		event.cancelBubble = false;
	}
	
	//Prevent this from firing until the submenu is properly "Parked"
	if(parseInt(promoteTopicBarObj.subMenu.style.right) == SUBMENU_RIGHT) {
		//Set/Clear the timeout
		clearTimeout(document.getElementById("subMenu").timeOut);
		promoteTopicBarObj.subMenu.timeOut = 0;
	
		if(!promoteTopicBarObj.subMenu.expanded) {
			SubMenuExpand();
		}
	} else if(client.userAgent.search(/konq/i) != -1 || client.userAgent.search(/khtml/i) != -1 || client.userAgent.search(/safari/i) != -1) {  //Konq/Safari
		//Set this as a little fall-back since that premature expansion script prevented Konq/Safari from triggering this one.
		//Set/Clear the timeout
		clearTimeout(document.getElementById("subMenu").timeOut);
		promoteTopicBarObj.subMenu.timeOut = 0;
	
		if(!promoteTopicBarObj.subMenu.expanded) {
			SubMenuExpand();
		}
	}
	
}

function SubMenuMouseOut(e) {
	promoteTopicBarObj.subMenu.timeOut = setTimeout("SubMenuCollapse()", SUBMENU_DURATION);
}		

//Animation Functions
function SubMenuExpand() {
	with(promoteTopicBarObj.subMenu.subPulldown) {
		if(promoteTopicBarObj.subMenu.subPulldown.timeOut == 0) { //Animation Starting - setup
			//Set "Hot"
			if(client.classChange)
        promoteTopicBarObj.subMenu.className = "hot";
			
			//First set it so that it's there but still "hidden
			style.display = SHOW;
			style.visibility = "";
			style.position = "absolute";
			style.width = "100%";
					
			//Now "roll" it up
			style.top = 0 - parseInt(offsetHeight) + "px";
			
			//Clip it
			promoteTopicBarObj.subMenu.subPulldown.topClip = parseInt(offsetHeight + parseInt(promoteTopicBarObj.subMenu.nub.offsetHeight));
			style.clip = "rect(" + promoteTopicBarObj.subMenu.subPulldown.topClip + "px, auto, auto, auto)";
		}
		
		if(parseInt(style.top) >= 0) { //Done
			promoteTopicBarObj.subMenu.expanded = true;
			
			//Reset Styles
			style.top = "0px";
			style.position = "relative";
			//style.width = "auto";
			style.clip = "rect(auto auto auto auto)";
			
			//Set Normal
			if(client.classChange)
        promoteTopicBarObj.subMenu.className = "";
			clearTimeout(promoteTopicBarObj.subMenu.subPulldown.timeOut);
			promoteTopicBarObj.subMenu.subPulldown.timeOut = 0;
		} else {
			//Clip it
			promoteTopicBarObj.subMenu.subPulldown.topClip = promoteTopicBarObj.subMenu.subPulldown.topClip - SUBMENU_STEP;
			style.clip = "rect(" + promoteTopicBarObj.subMenu.subPulldown.topClip + "px auto auto auto)";

			//Now "roll" it down
			style.top = (parseInt(style.top) + SUBMENU_STEP) > 0 ? 0 : (parseInt(style.top) + SUBMENU_STEP) + "px";
			
			//contentArea.innerHTML = contentArea.innerHTML + "top:" + style.top + " clip:" + style.clip + "<br />\n";
			promoteTopicBarObj.subMenu.subPulldown.timeOut = setTimeout("SubMenuExpand()", SUBMENU_SPEED);
		}
	}
}

function SubMenuCollapse() {
	with(promoteTopicBarObj.subMenu.subPulldown) {
		if(promoteTopicBarObj.subMenu.subPulldown.timeOut == 0) { //Animation Starting - setup
			//Set "Hot"
		  if(client.classChange)
        promoteTopicBarObj.subMenu.className = "hot";
			
			//First set it so that it's there but still "hidden
			style.position = "absolute";
			style.width = "100%";
			
			//Now "roll" it up
			style.top = "0px";
			
			//Clip it
			promoteTopicBarObj.subMenu.subPulldown.topClip = 0;
			style.clip = "rect(0px, auto, auto, auto)";
		}
		
		if(parseInt(style.top) <= parseInt(promoteTopicBarObj.subMenu.subPulldown.subBottom.offsetHeight) - (parseInt(offsetHeight) - parseInt(promoteTopicBarObj.subMenu.subPulldown.subBottom.offsetHeight))) { //Done
			promoteTopicBarObj.subMenu.expanded = false;
			style.display = HIDE; 
			visibility = "hidden";
			
			//Reset Styles
			style.top = "0px";
			style.position = "relative";
			style.width = "auto";
			style.clip = "rect(auto auto auto auto)";
			
			//Set Normal
			if(client.classChange)
        promoteTopicBarObj.subMenu.className = "";
			clearTimeout(promoteTopicBarObj.subMenu.subPulldown.timeOut);
			promoteTopicBarObj.subMenu.subPulldown.timeOut = 0;
		} else {
			//Clip it
			promoteTopicBarObj.subMenu.subPulldown.topClip = promoteTopicBarObj.subMenu.subPulldown.topClip + SUBMENU_STEP;
			style.clip = "rect(" + promoteTopicBarObj.subMenu.subPulldown.topClip + "px auto auto auto)";
			
			//Now "roll" it up
			style.top = parseInt(promoteTopicBarObj.subMenu.nub.offsetHeight) - parseInt(promoteTopicBarObj.subMenu.subPulldown.topClip) + "px";
			
			//contentArea.innerHTML = contentArea.innerHTML + "top:" + style.top + " clip:" + style.clip + "<br />\n";
			promoteTopicBarObj.subMenu.subPulldown.timeOut = setTimeout("SubMenuCollapse()", SUBMENU_SPEED);
		}
	}
}

function SubMenuAdd() {
	with(promoteTopicBarObj) {
		if(subMenu.timeOut == 0) { //timeout is dual use - also used for removal
			//alert("SubMenuAdd\n" + subMenu.style.right);
			if(client.classChange)
        subMenu.className = "hot";
			subMenu.style.right = 0 - client.width + "px";
			subMenu.subPulldown.style.display = SHOW;
			subMenu.subPulldown.style.visibility = "";

		}
		
		if(parseInt(subMenu.style.right) + Math.abs(parseInt(subMenu.style.right)/2) > 0) {
			subMenu.style.right = parseInt(subMenu.style.right) + Math.abs(parseInt(subMenu.style.right)/2) + "px";
		} else {
			subMenu.style.right = parseInt(subMenu.style.right) + (SUBMENU_RIGHT - parseInt(subMenu.style.right)/2) + "px";
		}
				
		if(parseInt(subMenu.style.right) < SUBMENU_RIGHT) {
			subMenu.timeOut = setTimeout("SubMenuAdd()", SUBMENU_SPEED);
		} else {
			subMenu.timeOut = 0;
			subMenu.style.right = SUBMENU_RIGHT + "px";
			subMenu.subPulldown.timeOut = 0;
			setTimeout("SubMenuCollapse()", SUBMENU_DURATION);
		}
	}
}

function SubMenuRemove() {
	//if(returnTopicBarObj.subMenu.timeOut == 0) { //timeout is dual use - also used for removal
		//alert("SubMenuRemove\n" + returnTopicBarObj.subMenu.style.right);
		//returnTopicBarObj.subMenu.className = "hot";
	//}
	//returnTopicBarObj.subMenu.style.left = parseInt(returnTopicBarObj.style.left)
	//alert("RTO:" + returnTopicBarObj.id + "\nPTO:" + promoteTopicBarObj.id);
	
	returnTopicBarObj.subMenu.style.right = 0 - (Math.abs(parseInt(returnTopicBarObj.subMenu.style.right)) + Math.abs(parseInt(returnTopicBarObj.subMenu.style.right))/3 ) + "px";
	
	if(Math.abs(parseInt(returnTopicBarObj.subMenu.style.right)) < client.width) {
		returnTopicBarObj.subMenu.timeOut = setTimeout("SubMenuRemove()", SUBMENU_SPEED);
	} else {
		//BLOW AWAY subMenu
		returnTopicBarObj.subMenu.timeOut = 0;
		returnTopicBarObj.removeChild(returnTopicBarObj.subMenu);
		returnTopicBarObj.subMenu = null;
	}
}

