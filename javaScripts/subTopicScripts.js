/*
	All scripts and graphics on this web site (c) 2007 David Snyder 
*/

function SubTopicCreate(subTopicSource) {
	var subTopic = document.createElement("div");

	//Control Attributes
	subTopic.timeOut = 0;
	subTopic.startLeft = 0;
	subTopic.startTop = 0;
	subTopic.contentLink = subTopicSource.getElementsByTagName("a")[0].getAttribute("href");
	
	//id in this case is used to uniquely identify the subTopicBar - Which comes in handy for context checking.  
	//Only flaw would be if there was a duplicate subTopic at the same level on a different topicBar.
	if(subTopicSource.getElementsByTagName("a")[0].xml) { //For IE if passed via XML object.
		subTopic.id = subTopicSource.getElementsByTagName("a")[0].text.replace(/\W/gi, "");
	} else {
		subTopic.id = subTopicSource.getElementsByTagName("a")[0].innerHTML.replace(/\W/gi, "");
	}
	
	//Event Handlers
	subTopic.onclick = SubTopicLink;
	subTopic.mouseover = SubTopicMouseOver;
	subTopic.mouseout = SubTopicMouseOut;
	
	//Methods
	subTopic.Add = SubTopicAdd;
	subTopic.Remove = SubTopicRemove;
	
	//Classes and Styles
	subTopic.className = "subTopic";
	
	subTopic.subTopicLeft = subTopic.appendChild(document.createElement("div"));
	subTopic.subTopicBody = subTopic.appendChild(document.createElement("div"));
	subTopic.subTopicRight = subTopic.appendChild(document.createElement("div"));

	with(subTopic) {
		//Set Styles
		subTopicLeft.className = "subTopicLeft";
		subTopicBody.className = "subTopicBody";
		subTopicRight.className = "subTopicRight";
		
		//Set Contents
		if(subTopicSource.getElementsByTagName("a")[0].xml) {
			subTopicBody.innerHTML = subTopicSource.getElementsByTagName("a")[0].text;
		} else {
			subTopicBody.innerHTML = subTopicSource.getElementsByTagName("a")[0].innerHTML;
		}
	}
	
	return subTopic;
} 

function GetSubTopics(topicBarContent) {
	var subTopics = null;
	var currLev = null;
	var offSet = 0;

	//RemoveBadNodes(topicBarContent).childNodes.length will be at least = 1, anothing above that is a subTopic.
	if(RemoveBadNodes(topicBarContent).childNodes.length > 1) { 
				
		//Kickstart it
		subTopics = SubTopicCreate(RemoveBadNodes(topicBarContent).childNodes[1]);

		//Set Positioning
		subTopics.style.position = "absolute";
		subTopics.style.top = SUBTOPIC_TOP + "px";

		if(client.userAgent.indexOf('msie') > -1 && client.appVersion < 7) { //Assuming MS will fix this POS in ver 7
			subTopics.style.width = "1%";
		}
		//subTopics.style.left = "0px";
		
		//Set Level Pointer
		currLev = subTopics;
		
		for(var i = 2; i < RemoveBadNodes(topicBarContent).childNodes.length; i++) {
			currLev.subTopic = currLev.appendChild(SubTopicCreate(RemoveBadNodes(topicBarContent).childNodes[i]));
			
			//Set Positioning
			currLev.subTopic.style.position = "absolute";
			currLev.subTopic.style.top = "0px";
			if(client.userAgent.indexOf('msie') > -1 && client.appVersion < 7) { //Assuming MS will fix this POS in ver 7
				currLev.subTopic.style.width = "1%";
			}
			//currLev.subTopic.style.left = 0 + "px";
			
			//Advance level pointer
			currLev = currLev.subTopic;

		}
	}
	
	return subTopics;
}

//SubTopic Link Handler
function SubTopicLink(e) {
	if(this.addEventListener) { //Mozilla
		e.cancelBubble = true;
	} else {  //IE
		event.cancelBubble = true;
	}
	//alert("SubTopic:" + this.contentLink);
	FetchContent(this.contentLink)
}

//SubTopic MouseOverHandlers
function SubTopicMouseOver(e) {
	if(this.addEventListener) { //Mozilla
		e.cancelBubble = true;
	} else {  //IE
		event.cancelBubble = false;
	}
	//alert(this);

}

function SubTopicMouseOut(e) {
	if(this.addEventListener) { //Mozilla
		e.cancelBubble = true;
	} else {  //IE
		event.cancelBubble = false;
	}
	//alert(this);

}		

function SubTopicAdd() {
	if(addSubTopicObj.timeOut == 0) { //timeout is dual use - also used for removal
		//Set Landing Locations
		//First Move backwards to see if it's the first item.
		var currLev = addSubTopicObj.parentNode;
		if(currLev) {
			if(currLev.className == "selectedBar") { //backed all the way up to the first item
				currLev.subTopic.startLeft = parseInt(currLev.childNodes[0].childNodes[1].childNodes[1].childNodes[0].offsetWidth + 12);
			} else {
				if(client.xmlLibrary == "Moz") { //ugly mozilla hack
					currLev.subTopicRight.style.right = "auto";
					currLev.subTopicRight.style.left = currLev.subTopicBody.offsetWidth + 8 + "px";
				}
				//currLev.subTopic.style.width = "100%";
				currLev.subTopic.startLeft = parseInt(currLev.childNodes[1].offsetWidth) + SUBTOPIC_SPACER;
				currLev.subTopic.style.top = "0px";
			}
		}		
		
		//Now traverse deep the other way.
		currLev = addSubTopicObj;
		
		while(currLev) {
			//Double check to see if this isn't the first bar item.
			if(currLev.parentNode.className == "selectedBar") {
				currLev.style.left = parseInt(currLev.parentNode.childNodes[1].offsetWidth) + "px";
			} else {
				if(client.xmlLibrary == "Moz") { //ugly mozilla hack
					currLev.subTopicRight.style.right = "auto";
					currLev.subTopicRight.style.left = currLev.subTopicBody.offsetWidth + 8 + "px";
				}
				//currLev.style.width = "100%";
				currLev.style.top = "0px";
				currLev.style.left = parseInt(currLev.parentNode.childNodes[1].offsetWidth) + SUBTOPIC_SPACER + "px";
			}
			//alert(currLev.style.left + "\nclass" + currLev.parentNode.className + "\nid:" + currLev.parentNode.id);
			//Move pointer
			currLev = currLev.subTopic;
		}
		
		//Move out beyond the screen
		addSubTopicObj.style.left = client.width + "px";
		if(client.classChange)
  		addSubTopicObj.className = "subTopicHot";
	}
	
	//alert("pause");
	addSubTopicObj.style.left = parseInt(addSubTopicObj.style.left) - (parseInt(addSubTopicObj.style.left) - addSubTopicObj.startLeft) / SUBTOPIC_STEP + "px";
	
	if(parseInt(addSubTopicObj.style.left) > addSubTopicObj.startLeft) {
		addSubTopicObj.timeOut = setTimeout("SubTopicAdd()", SUBTOPIC_SPEED);
	} else {
		addSubTopicObj.style.left = addSubTopicObj.startLeft + "px";
		addSubTopicObj.className = "subTopic";
		addSubTopicObj.timeOut = 0;
	}
}

function SubTopicRemove() {
	if(removeSubTopicObj.timeOut == 0) { //timeout is dual use - also used for removal
		//alert("SubTopicRemove\n" + removeSubTopicObj.style.position);
		//removeSubTopicObj.className = "subTopicHot";
	}
	
	removeSubTopicObj.style.left = (parseInt(removeSubTopicObj.style.left) + parseInt(removeSubTopicObj.style.left)/SUBTOPIC_STEP) + "px";
	
	if(parseInt(removeSubTopicObj.style.left) < client.width) {
		removeSubTopicObj.timeOut = setTimeout("SubTopicRemove()", SUBTOPIC_SPEED);
	} else {
		removeSubTopicObj.timeOut = 0;
		
		//BLOW AWAY subTopic
		//alert("Remove: " + removeSubTopicObj.id);
		var parentTopic = removeSubTopicObj.parentNode;
		try {
			parentTopic.removeChild(removeSubTopicObj);
			parentTopic.subTopic = false;
			if(parentTopic.parentNode.className == "selectedBar") {
				//parentTopic.style.width = "auto";
				//Fix annoying assed mozilla glitch
				if(client.userAgent.search(/gecko/) != -1) {
					//alert("ding");
					parentTopic.childNodes[2].style.left = parseInt(parentTopic.childNodes[1].offsetWidth) + 8 + "px";
				}				
			}
		} catch(e) {
			//alert("catch");
		}
		removeSubTopicObj = false;
		parentTopic = null;
	}
}
