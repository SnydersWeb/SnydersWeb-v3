/*
	All scripts and graphics on this web site (c) 2005 David Snyder 
*/

//As soon as the document is loaded, this will load it into the global xmlDoc.
function HandleReadyStateChange() {
	//alert(client.xmlHttp.readyState);
	var statusTxt;
		
	switch(client.xmlHttp.readyState) {
		case 0:
			statusTxt = "Opening";
			XMLLoadAnim(statusTxt);
			break;
			
		case 1:
			statusTxt = "Initializing";
			XMLLoadAnim(statusTxt);
			break;
			
		case 2:
			statusTxt = "Accessing";
			XMLLoadAnim(statusTxt);
			break;
			
		case 3:
			statusTxt = "Receiving";
			XMLLoadAnim(statusTxt);
			break;
			
		case 4:
			try {
				if(client.xmlHttp.status == 404) {
					statusTxt = "ERROR! " + client.xmlHttp.statusText;
					XMLLoadAnim(statusTxt);
					//Fall back.
					try {
						client.xmlHttp.abort();
					} catch(e){}
					fetchDocURL = "";
					SetLocationCookie();
					//FetchContent("./index.html");
				} else {
	
					//Stop Animation Sequence
					StopXMLLoadAnim();
					
					//Loaded!  Pass on and build DOM
					xmlDoc = client.ParseIntoXml(client.xmlHttp.responseText);
					
					//Process XML
					client.ChangeContextXML();				
				}
			} catch(e) {
				//Critical Error
				statusTxt = "ERROR! Parser Error\n\r<br />" + e;
				XMLLoadAnim(statusTxt);
				//Fall back.
				try {
					client.xmlHttp.abort();
				} catch(e){}
				fetchDocURL = "";
				SetLocationCookie();
				//FetchContent("./index.html");
			}	

			break;
			
		default:
			StopXMLLoadAnim();
			break;
	}
}

//REMOVE white spaces in XML file. Intended mainly for NS6/Mozilla
function RemoveBadNodes(xmlDocPart) {
	//Regular expression used to match any non-whitespace character
	var notWhitespace = /\S/

	for (var i = 0; i < xmlDocPart.childNodes.length; i++) {
		if(xmlDocPart.childNodes[i].nodeType == 3 && (!notWhitespace.test(xmlDocPart.childNodes[i].nodeValue))) {
			//alert("NodeType: " + xmlDocPart.childNodes[i].nodeType + "\nNodeValue: '" + xmlDocPart.childNodes[i].nodeValue + "'")
			// that is, if it's a whitespace text node
			xmlDocPart.removeChild(xmlDocPart.childNodes[i]);
			i--;
		}
	}
	
	return xmlDocPart;
}

//These functions parse the retrieved document into the xml tree - Client sets up pointers.
function IEParseIntoXml(strXML) {
	client.xmlParser.loadXML(strXML);
	return client.xmlParser;
}

function MozParseIntoXml(strXML) {
	return client.xmlParser.parseFromString(strXML, "text/xml");
}

//This function loads the XML Document
function GetExternalDocument(xmlDocFileName) {
	//This would be where the begin getXML process would start.
	try {
		client.xmlHttp.open("GET", xmlDocFileName, true); 
		client.xmlHttp.onreadystatechange = HandleReadyStateChange; 
		client.xmlHttp.send(null);
	} catch(e) { //These generally only occur when accessing locally and it's a 404.
		statusTxt = "ERROR!";
		XMLLoadAnim(statusTxt);
		client.xmlHttp.abort();
		//Fall Back on regular index.
		FetchContent("./index.html");
	}
}

//This function loads the Sends via XML
function SendXML(xmlContent, postURL) {
	//This would be where the begin getXML process would start.
	try {
   		client.xmlHttp.open("POST", postURL, true);
		client.xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
		client.xmlHttp.send(xmlContent);
		client.xmlHttp.onreadystatechange = HandleReadyStateChange; 
		return true;
	} catch(e) { //These generally only occur when accessing locally and it's a 404.
		statusTxt = "ERROR!" + client.xmlHttp.statusText;
		XMLLoadAnim(statusTxt);
		client.xmlHttp.abort();
		return false;
		//Fall Back on regular index.
		//FetchContent("./index.html");
	}
}

//Since the XML traversal mechanisms differ enough between IE and Moz - split them out and use the client object for a unified call.
function IEChangeContextXML() {
	//Sweep through bars to find out which one is selected and which one is indicated as the selected bar for the content.
	for(var i = 0; i < aryTopicBars.length; i++) {
		if(aryTopicBars[i].selected) {
			returnTopicBarObj = aryTopicBars[i]; //Found the selected bar
		} 
		if(RemoveBadNodes(xmlDoc.nodeFromID("selectedBar")).childNodes[0].getAttribute("id") == aryTopicBars[i].id) { 
			promoteTopicBarObj = aryTopicBars[i]; //Found the bar referenced in the content.
		} 
	}

	//Need stuff here to check bars, subtopics, and submenus
	if(returnTopicBarObj.id != promoteTopicBarObj.id) { //Topic Bar Change Necessary
		//Bar Changes also require subtopics be removed
		if(returnTopicBarObj.subTopic) {
			removeSubTopicObj = returnTopicBarObj.subTopic;
			removeSubTopicObj.Remove();
		}
		if(returnTopicBarObj.subMenu) {
			returnTopicBarObj.subMenu.Remove();
		}
		//Return old
		returnTopicBarObj.Return();
		
		//Promote new
		promoteTopicBarObj.Promote();
		
		//Append SubTopics
		if(GetSubTopics(xmlDoc.nodeFromID("selectedBar").childNodes[0].childNodes[1].childNodes[1])) { //Only has childnodes if it has anything.
			promoteTopicBarObj.subTopic = promoteTopicBarObj.appendChild(GetSubTopics(xmlDoc.nodeFromID("selectedBar").childNodes[0].childNodes[1].childNodes[1]));
			addSubTopicObj = promoteTopicBarObj.subTopic;
			addSubTopicObj.Add();
		}
		
		//Create, delete, and append SubMenu
		if(xmlDoc.nodeFromID("subBody")) {
			//Append SubMenu
			promoteTopicBarObj.subMenu = promoteTopicBarObj.appendChild(SubMenuCreate(xmlDoc.nodeFromID("subBody")));
			
			SubMenuAdd();
		}				

	} else { //No Bar change
		//Append SubTopics
		if(GetSubTopics(xmlDoc.nodeFromID("selectedBar").childNodes[0].childNodes[1].childNodes[1])) { //Only has childnodes if it has anything.
			
			//OK, item has subTopics, need code here to dig around and remove extras.
			var newSubTopics = GetSubTopics(xmlDoc.nodeFromID("selectedBar").childNodes[0].childNodes[1].childNodes[1]);
			var subTopics = promoteTopicBarObj.subTopic;
			
			//Traverse through both until they differ
			while(newSubTopics && subTopics) {
				if(newSubTopics.id != subTopics.id) {
					//alert("idMisMatch\nNew: " + newSubTopics.id + "\nOld: " + subTopics.id);
					break;
				}
				
				//Advance Pointer
				newSubTopics = newSubTopics.subTopic;
				
				if(subTopics.subTopic) { //This breaks before the pointer is advanced - mainly used for appending new subTopics.
					subTopics = subTopics.subTopic;
				} else { //End of subtopic chain - see if at end of newSubtopic chain too
					if(!newSubTopics) { //Advance it to the end of the subTopic chain so it'll be no/no
						subTopics = subTopics.subTopic;
					}
					break;
				}

			}
			
			//Pointer advanced to the point of last commonality - every point after this is difference.
			if(subTopics && !newSubTopics) { //SubTopic exists but newSubTopic doesn't - chop subTopic down
				//alert("chop");
				removeSubTopicObj = subTopics;
				removeSubTopicObj.Remove();


				//Create, delete, and append SubMenu
				if(xmlDoc.nodeFromID("subBody")) {
					//Clear subMenu if present
					try {			
						promoteTopicBarObj.subMenu.timeOut = 0;
						promoteTopicBarObj.removeChild(promoteTopicBarObj.subMenu);
						promoteTopicBarObj.subMenu = null;
					} catch(e) {}
				
					//Append SubMenu
					promoteTopicBarObj.subMenu = promoteTopicBarObj.appendChild(SubMenuCreate(xmlDoc.nodeFromID("subBody")));
					
					SubMenuAdd();
				}	
							
			} else if(subTopics && newSubTopics) { //subTopic exists and newSubTopic does.
				//alert("add");
				subTopics.subTopic = subTopics.appendChild(newSubTopics);
				addSubTopicObj = subTopics.subTopic;
				addSubTopicObj.Add();
				
				//Create, delete, and append SubMenu
				if(xmlDoc.nodeFromID("subBody")) {
					//Clear subMenu if present
					try {			
						promoteTopicBarObj.subMenu.timeOut = 0;
						promoteTopicBarObj.removeChild(promoteTopicBarObj.subMenu);
						promoteTopicBarObj.subMenu = null;
					} catch(e) {}
				
					//Append SubMenu
					promoteTopicBarObj.subMenu = promoteTopicBarObj.appendChild(SubMenuCreate(xmlDoc.nodeFromID("subBody")));
					
					SubMenuAdd();
				} else {
					//alert("Remove SubMenu");
					promoteTopicBarObj.subMenu.Remove();
					
				}	
							
			} else if(!subTopics && newSubTopics) { //Usually this will only fire in case of a first subTopic item on a bar.
				//alert("addNew");
				promoteTopicBarObj.subTopic = promoteTopicBarObj.appendChild(newSubTopics);
				addSubTopicObj = promoteTopicBarObj.subTopic;
				addSubTopicObj.Add();

				//Create, delete, and append SubMenu
				if(xmlDoc.nodeFromID("subBody")) {
					//Clear subMenu if present
					try {			
						promoteTopicBarObj.subMenu.timeOut = 0;
						promoteTopicBarObj.removeChild(promoteTopicBarObj.subMenu);
						promoteTopicBarObj.subMenu = null;
					} catch(e) {}
				
					//Append SubMenu
					promoteTopicBarObj.subMenu = promoteTopicBarObj.appendChild(SubMenuCreate(xmlDoc.nodeFromID("subBody")));
					
					SubMenuAdd();
				} 
			} else { //None on both	
				
			}
					
		} else { //No items, remove all
			//alert("no children");
			if(promoteTopicBarObj.subTopic) {
				removeSubTopicObj = promoteTopicBarObj.subTopic;
				removeSubTopicObj.Remove();
	
				//Create, delete, and append SubMenu
				if(xmlDoc.nodeFromID("subBody")) {
					//Clear subMenu if present
					try {			
						promoteTopicBarObj.subMenu.timeOut = 0;
						promoteTopicBarObj.removeChild(promoteTopicBarObj.subMenu);
						promoteTopicBarObj.subMenu = null;
					} catch(e) {}
				
					//Append SubMenu
					promoteTopicBarObj.subMenu = promoteTopicBarObj.appendChild(SubMenuCreate(xmlDoc.nodeFromID("subBody")));
					
					SubMenuAdd();
				}					
			}
		}
	}
	
	//Change Content - Remove was previously removed by FetchContent();
	client.ChangeContent();
	
	//Restore the Content Panel
	RestoreContentPanel();
}

function MozChangeContextXML() {
	//Sweep through bars to find out which one is selected and which one is indicated as the selected bar for the content.
	for(var i = 0; i < aryTopicBars.length; i++) {
		if(aryTopicBars[i].selected) {
			returnTopicBarObj = aryTopicBars[i]; //Found the selected bar
		} 
		if(RemoveBadNodes(xmlDoc.getElementById("selectedBar")).childNodes[0].id == aryTopicBars[i].id) { 
			promoteTopicBarObj = aryTopicBars[i]; //Found the bar referenced in the content.
		} 
	}
	
	//Need stuff here to check bars, subtopics, and submenus
	if(returnTopicBarObj.id != promoteTopicBarObj.id) { //Topic Bar Change Necessary
		//Bar Changes also require subtopics be removed
		if(returnTopicBarObj.subTopic) {
			removeSubTopicObj = returnTopicBarObj.subTopic;
			removeSubTopicObj.Remove();
		}
		if(returnTopicBarObj.subMenu) {
			returnTopicBarObj.subMenu.Remove();
		}
		//Return old
		returnTopicBarObj.Return();
		
		//Promote new
		promoteTopicBarObj.Promote();
		
		//Append SubTopics
		if(GetSubTopics(RemoveBadNodes(xmlDoc.getElementById("selectedBar").childNodes[0].childNodes[3]).childNodes[1])) { //Only has childnodes if it has anything.
			promoteTopicBarObj.subTopic = promoteTopicBarObj.appendChild(GetSubTopics(RemoveBadNodes(xmlDoc.getElementById("selectedBar").childNodes[0].childNodes[3]).childNodes[1]));
			addSubTopicObj = promoteTopicBarObj.subTopic;
			addSubTopicObj.Add();
		}
		
		//Create, delete, and append SubMenu
		if(xmlDoc.getElementById("subBody")) {
			//Append SubMenu
			promoteTopicBarObj.subMenu = promoteTopicBarObj.appendChild(SubMenuCreate(xmlDoc.getElementById("subBody")));
			
			SubMenuAdd();
		}		
		
	} else { //No Bar change
		//Append SubTopics
		if(GetSubTopics(RemoveBadNodes(xmlDoc.getElementById("selectedBar").childNodes[0].childNodes[3]).childNodes[1])) { //Only has childnodes if it has anything.

			//OK, item has subTopics, need code here to dig around and remove extras.
			var newSubTopics = GetSubTopics(RemoveBadNodes(xmlDoc.getElementById("selectedBar").childNodes[0].childNodes[3]).childNodes[1]);
			var subTopics = promoteTopicBarObj.subTopic;
			
			//Traverse through both until they differ
			while(newSubTopics && subTopics) {
				if(newSubTopics.id != subTopics.id) {
					//alert("idMisMatch\nNew: " + newSubTopics.id + "\nOld: " + subTopics.id);
					break;
				}
				
				//Advance Pointer
				newSubTopics = newSubTopics.subTopic;
				
				if(subTopics.subTopic) { //This breaks before the pointer is advanced - mainly used for appending new subTopics.
					subTopics = subTopics.subTopic;
				} else { //End of subtopic chain - see if at end of newSubtopic chain too
					if(!newSubTopics) { //Advance it to the end of the subTopic chain so it'll be no/no
						subTopics = subTopics.subTopic;
					}
					break;
				}

			}
			
			//Pointer advanced to the point of last commonality - every point after this is difference.
			if(subTopics && !newSubTopics) { //SubTopic exists but newSubTopic doesn't - chop subTopic down
				//alert("chop");
				removeSubTopicObj = subTopics;
				removeSubTopicObj.Remove();


				//Create, delete, and append SubMenu
				if(xmlDoc.getElementById("subBody")) {
					//Clear subMenu if present
					try {			
						promoteTopicBarObj.subMenu.timeOut = 0;
						promoteTopicBarObj.removeChild(promoteTopicBarObj.subMenu);
						promoteTopicBarObj.subMenu = null;
					} catch(e) {}
						
					//Append SubMenu
					promoteTopicBarObj.subMenu = promoteTopicBarObj.appendChild(SubMenuCreate(xmlDoc.getElementById("subBody")));
					
					SubMenuAdd();
				}	
							
			} else if(subTopics && newSubTopics) { //subTopic exists and newSubTopic does.
				//alert("add");
				subTopics.subTopic = subTopics.appendChild(newSubTopics);
				addSubTopicObj = subTopics.subTopic;
				addSubTopicObj.Add();
				
				//Create, delete, and append SubMenu
				if(xmlDoc.getElementById("subBody")) {
					//Clear subMenu if present
					try {			
						promoteTopicBarObj.subMenu.timeOut = 0;
						promoteTopicBarObj.removeChild(promoteTopicBarObj.subMenu);
						promoteTopicBarObj.subMenu = null;
					} catch(e) {}
				
					//Append SubMenu
					promoteTopicBarObj.subMenu = promoteTopicBarObj.appendChild(SubMenuCreate(xmlDoc.getElementById("subBody")));
					
					SubMenuAdd();
				} else {
					//alert("Remove SubMenu");
					promoteTopicBarObj.subMenu.Remove();
					
				}
							
			} else if(!subTopics && newSubTopics) { //Usually this will only fire in case of a first subTopic item on a bar.
				//alert("addNew");
				promoteTopicBarObj.subTopic = promoteTopicBarObj.appendChild(newSubTopics);
				addSubTopicObj = promoteTopicBarObj.subTopic;
				addSubTopicObj.Add();

				//Create, delete, and append SubMenu
				if(xmlDoc.getElementById("subBody")) {
					//Clear subMenu if present
					try {			
						promoteTopicBarObj.subMenu.timeOut = 0;
						promoteTopicBarObj.removeChild(promoteTopicBarObj.subMenu);
						promoteTopicBarObj.subMenu = null;
					} catch(e) {}
				
					//Append SubMenu
					promoteTopicBarObj.subMenu = promoteTopicBarObj.appendChild(SubMenuCreate(xmlDoc.getElementById("subBody")));
					
					SubMenuAdd();
				}	
			} else { //None on both	
				
			}
					
		} else { //No items, remove all
			//alert("no children");
			if(promoteTopicBarObj.subTopic) {
				removeSubTopicObj = promoteTopicBarObj.subTopic;
				removeSubTopicObj.Remove();
	
				//Create, delete, and append SubMenu
				if(xmlDoc.getElementById("subBody")) {
					//Clear subMenu if present
					try {			
						promoteTopicBarObj.subMenu.timeOut = 0;
						promoteTopicBarObj.removeChild(promoteTopicBarObj.subMenu);
						promoteTopicBarObj.subMenu = null;
					} catch(e) {}
				
					//Append SubMenu
					promoteTopicBarObj.subMenu = promoteTopicBarObj.appendChild(SubMenuCreate(xmlDoc.getElementById("subBody")));
					
					SubMenuAdd();
				}					
			}
		}
	}
	
	//Change Content - Remove was previously removed by FetchContent();
	client.ChangeContent();
	
	//Restore the Content Panel
	RestoreContentPanel();
}

function IEChangeContent() {
	//Change all links
	for(var i = 0; i < xmlDoc.nodeFromID("content").getElementsByTagName("a").length; i++) {
		try {
			//alert("Changing:\n " + xmlDoc.getElementsByTagName("body")[0].childNodes[4].childNodes[10].childNodes[1].getElementsByTagName("a")[i].getAttribute("href"));
			xmlDoc.nodeFromID("content").replaceChild(xmlDoc.nodeFromID("content").getElementsByTagName("a")[i], FixLink(xmlDoc.nodeFromID("content").getElementsByTagName("a")[i]));
		} catch(e) {
			//alert("FillContent:\n" + e.description);
		}
	}

	//Change all image URLs
	for(var i = 0; i < xmlDoc.nodeFromID("content").getElementsByTagName("img").length; i++) {
		try {
			if(xmlDoc.nodeFromID("content").getElementsByTagName("img")[i].getAttribute("src").search("http") == -1)
				xmlDoc.nodeFromID("content").getElementsByTagName("img")[i].setAttribute("src", dirContext + xmlDoc.nodeFromID("content").getElementsByTagName("img")[i].getAttribute("src"));
		} catch(e) {
			//alert("FillContent:\n" + e);
		}
	}
		
	//Clean up outer Tag of Content Div
	xmlDoc.nodeFromID("contentArea").getElementsByTagName("div")[0].removeAttribute("class");
	
	//Remove gapper div
	xmlDoc.nodeFromID("content").removeChild(xmlDoc.nodeFromID("subMenuGapper"));
	
	//This actually fills content
	document.getElementById("content").innerHTML = xmlDoc.nodeFromID("content").xml; 
}

function MozChangeContent() {
	//Change all links
	for(var i = 0; i < xmlDoc.getElementById("content").getElementsByTagName("a").length; i++) {
		try {
			xmlDoc.getElementById("content").getElementsByTagName("a")[i] = FixLink(xmlDoc.getElementById("content").getElementsByTagName("a")[i]);
		} catch(e) {
			//alert("FillContent:\n" + e);
		}
	}

	//Change all image URLs
	for(var i = 0; i < xmlDoc.getElementById("content").getElementsByTagName("img").length; i++) {
		try {
			if(xmlDoc.getElementById("content").getElementsByTagName("img")[i].getAttribute("src").search("http") == -1)
				xmlDoc.getElementById("content").getElementsByTagName("img")[i].setAttribute("src", dirContext + xmlDoc.getElementById("content").getElementsByTagName("img")[i].getAttribute("src"));
		} catch(e) {
			//alert("FillContent:\n" + e);
		}
	}
	
	//Remove gapper div
	xmlDoc.getElementById("content").removeChild(xmlDoc.getElementById("subMenuGapper"));
		
	//This actually fills content
	document.getElementById("content").innerHTML = xmlDoc.getElementById("content").innerHTML;
}


function XMLLoadAnim(statusTxt) {
	loaderStatusDiv.innerHTML = statusTxt;
	loaderStatusDiv.style.visibility = "";
	loaderStatusDiv.style.display = SHOW;
	loaderStatusDiv.style.left = (client.width/2 - parseInt(loaderStatusDiv.offsetWidth)/2) + "px";
	loaderStatusDiv.style.top = (client.height/2 - parseInt(loaderStatusDiv.offsetHeight)/2) + "px";
}

function StopXMLLoadAnim() {
	loaderStatusDiv.innerHTML = "";
	loaderStatusDiv.style.display = HIDE;
	loaderStatusDiv.style.visibility = "hidden";
}



