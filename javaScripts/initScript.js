/*
	All scripts and graphics on this web site (c) 2007 David Snyder 
*/

function Client() {
	this.appCodeName = navigator.appCodeName.toLowerCase();
	this.appName = navigator.appName.toLowerCase();
	this.appMinorVersion = navigator.appMinorVersion;
	this.platform = navigator.platform.toLowerCase();
	this.systemLanguage = navigator.systemLanguage;
	this.userLanguage = navigator.userLanguage;
	this.appVersion = parseInt(navigator.appVersion);
	this.userAgent = navigator.userAgent.toLowerCase();
	this.cookieEnabled = navigator.cookieEnabled;
	this.classChange = true;
	
	//XML Stuff
	this.xmlLibrary = false;
	this.xmlHttp = false;
	this.xmlParser = false;
	
	if(/msie/ig.test(this.userAgent)) {
		//Correct what version it uses
		this.appVersion = parseFloat(this.userAgent.slice(this.userAgent.indexOf('msie') + 5, this.userAgent.indexOf(this.userAgent.indexOf('msie') + 5, this.userAgent.indexOf(';'))));

		//IE 7 temporarily barred until Microsoft de-turdifies it more
		if(this.appVersion >= 5.5 && this.appVersion <= 8) { //Had to filter 5.0 that supports getElementById but still doesn't handle with correctly.
			this.smellsGood = true;
			
			//IE 7 doesn't do class changes too well - is barfing hard!
			if(this.appVersion > 6)
			  this.classChange = false;
						
			if(document.documentElement && document.documentElement.clientHeight) { //Newer IE
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;
			} else { //Legacy IE
  			this.width = document.body.clientWidth;
	   		this.height = document.body.clientHeight;
      }
			
			//Filter out IE 5 for Mac - 5 stinks and is dead.
			if(this.platform.indexOf('win32')==-1) {
				this.smellsGood = false;
			} else if(window.ActiveXObject) { //Not IE/MAC - lets look for and establish which XML Requestor it has.
				var aryActiveXObj = ["MSXML3.XMLHTTP", "MSXML2.XMLHTTP", "MSXML.XMLHTTP", "Microsoft.XMLHTTP"];
		
			    //Which One does it have?
			    for(var i = 0; i < aryActiveXObj.length; i++) {
			        //Try Different Objects until we find the right one.
			        try {
			            this.xmlHttp = new ActiveXObject(aryActiveXObj[i]);
						this.xmlLibrary = String(aryActiveXObj[i]);
			            break; //found it              
			        } catch(e) { 
						//Keep looking.
						this.xmlHttp = false;
			        } 
			    } 
				
				//Now let's get the Parser
				var aryActiveXObj = ["MSXML4.DOMDocument", "MSXML3.DOMDocument", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XmlDom"];

			    //Which One does it have?
			    for(var i = 0; i < aryActiveXObj.length; i++) {
			        //Try Different Objects until we find the right one.
			        try {
			            this.xmlParser = new ActiveXObject(aryActiveXObj[i]);
			            break; //found it              
			        } catch(e) { 
						//Keep looking.
						this.xmlParser = false;
			        } 
			    } 
				this.xmlParser.async = false; //Enforce download of XML file first. IE only.

				//Function Pointers
				this.ParseIntoXml = IEParseIntoXml;
				this.ChangeContent = IEChangeContent;
				this.ChangeContextXML = IEChangeContextXML;
				
			}
		} else {
			this.smellsGood = false;
		}
	} else if(/netscape/ig.test(this.userAgent)) { //netscape, find out if it's not 4
		if(this.appVersion >= 7.2) { //7.2 or higher might work
			this.smellsGood = true;
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		
			if (document.implementation && document.implementation.createDocument) {
				//Get Requestor
				try { 
					this.xmlHttp = new XMLHttpRequest(); 
					this.xmlLibrary = "Moz";
				} catch (e) { 
					this.xmlHttp = false; 
				} 
				
				//Get Parser
				try { 
					this.xmlParser = new DOMParser();
				} catch (e) { 
					this.xmlParser = false; 
				} 
				
				//Function Pointers
				this.ParseIntoXml = MozParseIntoXml;
				this.ChangeContent = MozChangeContent;
				this.ChangeContextXML = MozChangeContextXML;
				
			}
			
		} else {
			this.smellsGood = false;
		}
	} else if(/gecko|khtml|chrome/ig.test(this.userAgent)) { //the real Gecko/Mozilla/FireFox
		this.smellsGood = true;
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		//XML Objects
		if (document.implementation && document.implementation.createDocument) {
			//Get Requestor
			try { 
				this.xmlHttp = new XMLHttpRequest(); 
				this.xmlLibrary = "Moz";
			} catch (e) { 
				this.xmlHttp = false; 
			} 
			
			//Get Parser
			try { 
				this.xmlParser = new DOMParser();
			} catch (e) { 
				this.xmlParser = false; 
			} 

			//Function Pointers
			this.ParseIntoXml = MozParseIntoXml;
			this.ChangeContent = MozChangeContent;
			this.ChangeContextXML = MozChangeContextXML;
				
		}

	} else if(/konq|khtml|safari/ig.test(this.userAgent)) {  //Konq/Safari
		this.smellsGood = true;
		//Sticking with the Netscape tack on width/height - the W3C doesn't have anything documented I know of for this.
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		
		//browser is good, but not quite a Jedi yet - will keep checking on this one though.  XML requestor doesn't work like the other two.  
		
			
	} else {
		this.smellsGood = false;
	}
	
}

function InitInterface() {
	//set up global client object
	client = new Client();
	
	//If good client, proceed on.
	//alert("XML Check:\n" + "Requestor:" + client.xmlHttp + "\nParser:" + client.xmlParser + "\nLibrary:" + client.xmlLibrary);
	
	if(client.xmlHttp) {
		//Hide CircuitBG
		//document.getElementById("circuitBG").style.display = HIDE;
		document.getElementById("circuitBG").style.visibility = "hidden";
		
		//First do a cookie check	
		//This block is responsible for kicking people back to the last page they requested.
		var cookieVal = FetchLocationCookie();
		//alert("cookieVal: " + cookieVal + "\nlocation: " + window.location.href);
		
		if(cookieVal == window.location.href || cookieVal == "") {
			fetchDocURL = window.location.href;
			SetLocationCookie();
		} else {
			window.location.href = cookieVal;
		}
		
		//Add resize handler
		window.onresize = HandleResize;
		
		//Get contentArea
		contentArea = document.getElementById("content");
		contentArea.rightClip = parseInt(contentArea.offsetWidth);
		contentArea.timeOut = 0;
		
		//Fix links in content to go through requester system.
		//Change all links
		//Fix links in content to go through requester system.
		for(var i = 0; i < contentArea.getElementsByTagName("a").length; i++) {
			try {
				contentArea.replaceChild(contentArea.getElementsByTagName("a")[i], FixLink(contentArea.getElementsByTagName("a")[i]));
			} catch(e) {
			}
		}	
		
		
		//Remove gapper div
		contentArea.removeChild(document.getElementById("subMenuGapper"));
					
		//Set up globals
		SEL_BAR_WIDTH = client.width - (SEL_BAR_LEFT + MARGIN);
		CONT_PAN_WIDTH = client.width - CONT_PAN_LEFT;
		
		if(client.userAgent.indexOf('msie') > -1 && client.appVersion < 7) { //Assuming MS will fix this POS in ver 7
			CONT_PAN_HEIGHT = client.height - (CONT_PAN_TOP + MARGIN + MARGIN + parseInt(document.getElementById("contentBottom").offsetHeight) + parseInt(document.getElementById("contentTop").offsetHeight));
		} else {
			CONT_PAN_HEIGHT = parseInt(document.getElementById("contentPanel").offsetHeight);
		}
		
		//This grabs the topic bars and loads them into aryTopicBars.
		GetTopicBars();
		
		//Set up Topic Bars.
		for(var i = 0; i < aryTopicBars.length; i++) {
			document.getElementById("circuitBG").appendChild(aryTopicBars[i]);
			aryTopicBars[i].className = "unSelectedBar";
			aryTopicBars[i].style.display = HIDE;
			aryTopicBars[i].style.visibility = "hidden";
			aryTopicBars[i].style.left = (0 - UNSEL_BAR_WIDTH * (i + 1)) + "px";
			aryTopicBars[i].style.top = aryTopicBars[i].startTop + "px";

			if(aryTopicBars[i].selected) {
				//Set Bar holder
				promoteTopicBarObj = aryTopicBars[i];
				
				//if it has subtopics, set the pointer
				addSubTopicObj = promoteTopicBarObj.subTopic;
				if(addSubTopicObj) {
					addSubTopicObj.style.display = HIDE;
					addSubTopicObj.style.visibility = "hidden";
				}
				
				//If it has a submenu - deal with that
				if(promoteTopicBarObj.subMenu) {
					promoteTopicBarObj.subMenu.style.right = 0 - client.width + "px";
					promoteTopicBarObj.subMenu.style.display = HIDE;
					promoteTopicBarObj.subMenu.style.visibility = "hidden";
				}
			} 
		}
		
		//Create loader notification div
		loaderStatusDiv = document.getElementById("circuitBG").appendChild(document.createElement("div"));
		loaderStatusDiv.id = "loaderStatus";
		loaderStatusDiv.style.left = client.width/2 + "px";
		loaderStatusDiv.style.top = client.height/2 + "px";
		loaderStatusDiv.style.display = HIDE;
		loaderStatusDiv.style.visibility = "hidden";
				
		//Set up "sparky" - part of body rather than circuitBG since it will float around everywhere.
		sparkObj = document.body.appendChild(document.createElement("div"));
		sparkObj.id = "sparky";
		sparkObj.timeOut = 0;
		sparkObj.dormentTimeOut = 0;
		sparkObj.style.position = "absolute";

		//Hide Logo
		document.getElementById("logo").style.display = HIDE;
		document.getElementById("logo").style.visibility = "hidden";
		
		//Hide PrintStuff
		document.getElementById("printLogo").style.display = HIDE;
		document.getElementById("printLogo").style.visibility = "hidden";
		document.getElementById("printLogoCover").style.display = HIDE;
		document.getElementById("printLogoCover").style.visibility = "hidden";
		
		//Hide Content Panel
		document.getElementById("contentPanel").style.display = HIDE;
		document.getElementById("contentPanel").style.visibility = "hidden";
		
		//Hide CircuitBG
		document.getElementById("circuitBG").style.display = HIDE;
		//document.getElementById("circuitBG").style.visibility = "hidden";
		
		//Create cacheDiv
		cacheDiv = document.body.appendChild(document.createElement("div"));
		cacheDiv.id = "cacheDiv";
		cacheDiv.images = new Array("interfaceImages/bgTile.gif", "interfaceImages/logo.gif", "interfaceImages/spacer.gif", "interfaceImages/contentPanelBody.gif", "interfaceImages/contentPanelBodyHot.gif", "interfaceImages/contentPanelBot.gif", "interfaceImages/contentPanelBotHot.gif", "interfaceImages/contentPanelBotLeft.gif", "interfaceImages/contentPanelBotLeftHot.gif", "interfaceImages/contentPanelBotLeftInner.gif", "interfaceImages/contentPanelBotLeftInnerHot.gif", "interfaceImages/contentPanelBotRight.gif", "interfaceImages/contentPanelBotRightHot.gif", "interfaceImages/contentPanelBotRightInner.gif", "interfaceImages/contentPanelBotRightInnerHot.gif", "interfaceImages/contentPanelLeftDouble.gif", "interfaceImages/contentPanelLeftDoubleEnd.gif", "interfaceImages/contentPanelLeftDoubleEndHot.gif", "interfaceImages/contentPanelLeftDoubleHot.gif", "interfaceImages/contentPanelLeftThick.gif", "interfaceImages/contentPanelLeftThickHot.gif", "interfaceImages/contentPanelLeftThin.gif", "interfaceImages/contentPanelLeftThinHot.gif", "interfaceImages/contentPanelLeftTop.gif", "interfaceImages/contentPanelLeftTopHot.gif", "interfaceImages/contentPanelLeftTrans.gif", "interfaceImages/contentPanelLeftTransHot.gif", "interfaceImages/contentPanelRightBot.gif", "interfaceImages/contentPanelRightBotHot.gif", "interfaceImages/contentPanelRightDouble.gif", "interfaceImages/contentPanelRightDoubleEnd.gif", "interfaceImages/contentPanelRightDoubleEndHot.gif", "interfaceImages/contentPanelRightDoubleHot.gif", "interfaceImages/contentPanelRightThick.gif", "interfaceImages/contentPanelRightThickHot.gif", "interfaceImages/contentPanelRightThin.gif", "interfaceImages/contentPanelRightThinHot.gif", "interfaceImages/contentPanelRightTrans.gif", "interfaceImages/contentPanelRightTransHot.gif", "interfaceImages/contentPanelTop.gif", "interfaceImages/contentPanelTopHot.gif", "interfaceImages/contentPanelTopLeft.gif", "interfaceImages/contentPanelTopLeftHot.gif", "interfaceImages/contentPanelTopLeftInner.gif", "interfaceImages/contentPanelTopLeftInnerHot.gif", "interfaceImages/contentPanelTopRight.gif", "interfaceImages/contentPanelTopRightHot.gif", "interfaceImages/contentPanelTopRightInner.gif", "interfaceImages/contentPanelTopRightInnerHot.gif", "interfaceImages/barBody.gif", "interfaceImages/barBodyHot.gif", "interfaceImages/barBodySel.gif", "interfaceImages/barBotDropRight.gif", "interfaceImages/barBotDropRightHot.gif", "interfaceImages/barBotDropRightSel.gif", "interfaceImages/barLeftBot.gif", "interfaceImages/barLeftBotHot.gif", "interfaceImages/barLeftBotSel.gif", "interfaceImages/barLeftTop.gif", "interfaceImages/barLeftTopHot.gif", "interfaceImages/barLeftTopSel.gif", "interfaceImages/barRightBot.gif", "interfaceImages/barRightBotHot.gif", "interfaceImages/barRightBotSel.gif", "interfaceImages/barRightTop.gif", "interfaceImages/barRightTopHot.gif", "interfaceImages/barRightTopSel.gif", "interfaceImages/subMenuBotLeft.gif", "interfaceImages/subMenuBotLeftHot.gif", "interfaceImages/subMenuBotRight.gif", "interfaceImages/subMenuBotRightHot.gif", "interfaceImages/subMenuNubLeft.gif", "interfaceImages/subMenuNubLeftHot.gif", "interfaceImages/subMenuNubRight.gif", "interfaceImages/subMenuNubRightHot.gif", "interfaceImages/subTopicLeft.gif", "interfaceImages/subTopicLeftHot.gif", "interfaceImages/subTopicLeftSel.gif", "interfaceImages/subTopicRight.gif", "interfaceImages/subTopicRightHot.gif", "interfaceImages/subTopicRightSel.gif", "interfaceImages/spark1.gif", "interfaceImages/spark2.gif", "interfaceImages/spark3.gif", "interfaceImages/spark4.gif", "interfaceImages/spark5.gif", "interfaceImages/printLogo.gif");
		cacheDiv.imageCount = cacheDiv.images.length;
		
		//Set the first trigger
		//Append images and properties to CacheDiv
		for(var i = 0; i < cacheDiv.images.length; i++) {
			image = cacheDiv.appendChild(document.createElement("img"));
			image.src = siteRoot + cacheDiv.images[i];
			//Set special trigger on the first image (BG Tile)
			if(i == 0) {
				if(image.complete) { //image already loaded - force fire event
					PreloadSequence();
				} else { 
					image.onload = PreloadSequence; //Once this loads it kicks off the sequence.
				}
			} 
		}
									
	} else if(client.smellsGood) { 
		//OK no XML requestor that meets standards but supports at least some features - give them pull down submenus.
		//If the bar is selected - look for some extra attributes.
		promoteTopicBarObj = document.getElementById("subMenu").parentNode;
			
		if(client.userAgent.search(/konq/i) != -1 || client.userAgent.search(/khtml/i) != -1 || client.userAgent.search(/safari/i) != -1) { 
			//Get contentArea
			contentArea = document.getElementById("content");
		
			//Remove gapper div
			contentArea.removeChild(document.getElementById("subMenuGapper"));
		}
				
		//Build SubMenu tree and link in scripts.
		if(document.getElementById("subMenu")) {
			promoteTopicBarObj.subMenu = document.getElementById("subMenu");
			promoteTopicBarObj.subMenu.nub = document.getElementById("nub");
			promoteTopicBarObj.subMenu.subPulldown = document.getElementById("subPulldown");
			promoteTopicBarObj.subMenu.subPulldown.subBottom = document.getElementById("subBottom");

			promoteTopicBarObj.subMenu.style.right = "9px";
						
			promoteTopicBarObj.subMenu.expanded = false;
			promoteTopicBarObj.subMenu.timeOut = 0;
			promoteTopicBarObj.subMenu.subPulldown.timeOut = 0;
			
			promoteTopicBarObj.subMenu.subPulldown.style.display = HIDE; 
			promoteTopicBarObj.subMenu.subPulldown.style.visibility = "hidden";
			
			//Event Handlers
			promoteTopicBarObj.subMenu.onmouseover = SubMenuMouseOver;
			promoteTopicBarObj.subMenu.onmouseout = SubMenuMouseOut;

		}
		
		
	}

}

function PreloadSequence() { //Unfurrow the background
	with(document.getElementById("circuitBG")) {
		if(style.display == HIDE) { //First run - unhide and set clip start
			style.display = SHOW;
			rightClip = 0;
			topBottomClip = parseInt(offsetHeight)/2;
			style.clip = "rect(" + (topBottomClip - 1) + "px 0px " + (topBottomClip + 1) + "px auto)";
			style.visibility = "";	
		}
		
		if(rightClip < parseInt(offsetWidth)) {
			rightClip = Math.round(rightClip + (parseInt(offsetWidth) - rightClip)/2);
			style.clip = "rect(" + (topBottomClip - 1) + "px " + rightClip + "px " + (topBottomClip + 1) + "px auto)";
		} else {
			topBottomClip = (topBottomClip/2 > 1) ? topBottomClip/2 : 0;
			style.clip = "rect(" + topBottomClip + "px auto " + (parseInt(offsetHeight) - topBottomClip) + "px auto)";
		}
		
		if(rightClip < parseInt(offsetWidth) || topBottomClip > 0) {
			setTimeout("PreloadSequence()", 50);
		} else {
			rightClip = null;
			topBottomClip = null;
			
			//Clear all clipping
			style.clip = "rect(auto auto auto auto)";
			
			//Now that the bg is fully showing - restore hidden elements behind it
			document.getElementById("printLogo").style.display = SHOW;
			document.getElementById("printLogo").style.visibility = "";
			document.getElementById("printLogoCover").style.display = SHOW;
			document.getElementById("printLogoCover").style.visibility = "";			
			
			var image = cacheDiv.getElementsByTagName("img")[1];
			if(image.complete) //image already loaded - force fire event
				ApparateLogo();
			else
				image.onload = ApparateLogo; //Once this loads it kicks off the sequence.
			
		}
	}
}

function ApparateLogo() {
	with(document.getElementById("logo")) {
		if(style.display == HIDE) { //First run - unhide and set clip start
			style.display = SHOW;
			sizeFactor = 8;
			height = parseInt(getElementsByTagName("img")[0].height);
			width = parseInt(getElementsByTagName("img")[0].width);
			getElementsByTagName("img")[0].height = getElementsByTagName("img")[0].height/sizeFactor;
			getElementsByTagName("img")[0].width = getElementsByTagName("img")[0].width/sizeFactor;
			style.top = (client.height/2 - getElementsByTagName("img")[0].height/2) + "px";
			style.left = (client.width/2 - getElementsByTagName("img")[0].width/2) + "px";
			style.visibility = "";	
		}
		
		if(sizeFactor > 1) {
			sizeFactor--;
			getElementsByTagName("img")[0].height = height/sizeFactor;
			getElementsByTagName("img")[0].width = width/sizeFactor;
			style.top = (client.height/2 - getElementsByTagName("img")[0].height/2) + "px";
			style.left = (client.width/2 - getElementsByTagName("img")[0].width/2) + "px";
			setTimeout("ApparateLogo()", 50);
		} else {
			getElementsByTagName("img")[0].height = height;
			getElementsByTagName("img")[0].width = width;
			style.top = (client.height/2 - offsetHeight/2) + "px";
			style.left = (client.width/2 - offsetWidth/2) + "px";

			sizeFactor = null;
			height = null;
			width = null;
			
			//Now to slide in the content Panel
			var image = cacheDiv.getElementsByTagName("img")[48];
			if(image.complete) //image already loaded - force fire event
				SlideInContentPanel();
			else
				image.onload = SlideInContentPanel; //Once this loads it kicks off the sequence.
			
		}				
	}	
}

function SlideInContentPanel() {
	with(document.getElementById("contentPanel")) {
		if(style.display == HIDE) { //First run - unhide and set clip start
			style.display = SHOW;
			
			//Set "Hot"
			if(client.classChange)
			 className = "hot";
			
			//Hide content
			document.getElementById("content").style.clip = "rect(auto 0px auto auto)";
			document.getElementById("content").style.display = HIDE;
			document.getElementById("content").style.visibility = "hidden";
			
			if(client.userAgent.indexOf('msie') > -1 && client.appVersion < 7) { //Assuming MS will fix this POS in ver 7
				style.top = "0px";
				document.getElementById("contentTop").style.top = "0px";
				document.getElementById("contentBody").style.top = parseInt(document.getElementById("contentTop").style.top) + "px";
				document.getElementById("contentBody").style.height = parseInt(document.getElementById("logo").offsetHeight) - (parseInt(document.getElementById("contentTop").offsetHeight) + parseInt(document.getElementById("contentBottom").offsetHeight)) + "px";
				document.getElementById("contentBottom").style.top = "0px";
			} else {
				style.bottom = "auto";
			}
			
			style.left = client.width + "px";
			style.width = "300px";
			style.height = parseInt(document.getElementById("logo").offsetHeight) + "px";
			style.top = parseInt(document.getElementById("logo").style.top) + "px";
			
			//Temporarily override side styles to prevent ugly overshoots
			document.getElementById("leftThick").style.height = "28%";
			document.getElementById("rightThin").style.height = "18%";
			document.getElementById("rightDouble").style.height = "30%";
			document.getElementById("rightThick").style.height = "20%";
			
			//Set the destination for this phase
			document.getElementById("logo").leftDest = client.width/2 - (parseInt(document.getElementById("logo").offsetWidth) + parseInt(style.width) + 10)/2;
			leftDest = parseInt(document.getElementById("logo").leftDest) + parseInt(document.getElementById("logo").offsetWidth) + 10;

			style.visibility = "";	
		}
		
		//Shift Logo
		if(parseInt(document.getElementById("logo").style.left) > document.getElementById("logo").leftDest) {
			document.getElementById("logo").style.left = (parseInt(document.getElementById("logo").style.left) - (parseInt(document.getElementById("logo").style.left) - document.getElementById("logo").leftDest)/2) + "px";
		}
		
		//Shift Content Panel
		if(parseInt(style.left) > leftDest) {
			style.left = (parseInt(style.left) - (parseInt(style.left) - leftDest)/2) + "px";
		}
		
		if(parseInt(document.getElementById("logo").style.left) > document.getElementById("logo").leftDest || parseInt(style.left) > leftDest) {
			setTimeout("SlideInContentPanel()", 30);
		} else {
			//Flag it regular
			if(client.classChange)
  			className = "";
			
			//Add a temporary div inside the Content Panal for the purpose of displaying image names as they load.
			document.getElementById("contentArea").loaderDiv = document.getElementById("contentArea").appendChild(document.createElement("div"));
			document.getElementById("contentArea").loaderDiv.id = "loaderDiv";
						
			if(client.userAgent.indexOf('msie') > -1 && client.appVersion <= 7) { //IE 7 STILL needs the height manually set!
				document.getElementById("contentArea").loaderDiv.style.height = parseInt(document.getElementById("contentArea").offsetHeight) + "px";
			} 
			
			document.getElementById("contentArea").loaderDiv.className = "bodyText";
			document.getElementById("contentArea").loaderDiv.lastIndex = 0;
			
			//Now onto the loader
			FinalLoadImages();
		}
		
	}
}

function FinalLoadImages() {
  with(document.getElementById("contentArea").loaderDiv) {
		//add all the images that have loaded thus far
		var image = cacheDiv.getElementsByTagName("img")[lastIndex];
		while(image) {
			if(image.complete) {
			  innerHTML += image.src.substring(image.src.lastIndexOf("/") + 1, image.src.length) + "<br />";
			  lastIndex++;
				image = cacheDiv.getElementsByTagName("img")[lastIndex];
			} else {
				break;
			}
		}
	}		
	
	if(document.getElementById("contentArea").loaderDiv.lastIndex < cacheDiv.getElementsByTagName("img").length) {
		setTimeout("FinalLoadImages()", 30);
	} else {
		//All Images confirmed loaded - on to the next step
		//Destroy temporary div
		document.getElementById("contentArea").removeChild(document.getElementById("contentArea").loaderDiv);
		
		FinalLogoAndPanelPark();
	}
}

function FinalLogoAndPanelPark() {
	//Set "Hot"
  if(client.classChange)
	 document.getElementById("contentPanel").className = "hot";

	//Shift Logo
	if(parseInt(document.getElementById("logo").style.left) > 5) {
		document.getElementById("logo").style.left = (parseInt(document.getElementById("logo").style.left) - (parseInt(document.getElementById("logo").style.left) - 5)/2) + "px";
	}
	if(parseInt(document.getElementById("logo").style.top) > 5) {
		document.getElementById("logo").style.top = (parseInt(document.getElementById("logo").style.top) - (parseInt(document.getElementById("logo").style.top) - 5)/2) + "px";
	}
		
	//Shift Content Panel
	if(parseInt(document.getElementById("contentPanel").style.left) > CONT_PAN_LEFT) {
		document.getElementById("contentPanel").style.left = (parseInt(document.getElementById("contentPanel").style.left) - (parseInt(document.getElementById("contentPanel").style.left) - CONT_PAN_LEFT)/2) + "px";
	}
	if(parseInt(document.getElementById("contentPanel").style.top) > CONT_PAN_TOP) {
		document.getElementById("contentPanel").style.top = (parseInt(document.getElementById("contentPanel").style.top) - (parseInt(document.getElementById("contentPanel").style.top) - CONT_PAN_TOP)/2) + "px";
	}

	if(parseInt(document.getElementById("logo").style.left) > 5	|| parseInt(document.getElementById("logo").style.top) > 5 || parseInt(document.getElementById("contentPanel").style.left) > CONT_PAN_LEFT || parseInt(document.getElementById("contentPanel").style.top) > CONT_PAN_TOP) {
		setTimeout("FinalLogoAndPanelPark()", 30);
	} else {
		if(client.classChange)
    	document.getElementById("contentPanel").className = "";
		
		//Drop style so it'll revert back to stylesheet.
		document.getElementById("contentPanel").style.left = "";
		
		ExpandContentPanel();

		//Unhide Bars and restore styles.
		for(var i = 0; i < aryTopicBars.length; i++) {
			aryTopicBars[i].style.display = SHOW;
			aryTopicBars[i].style.visibility = "";
			if(client.classChange)
        aryTopicBars[i].childNodes[0].className = "topicBarHot";
		}
		SlideBarsIn();
	}
}

function ExpandContentPanel() {
	with(document.getElementById("contentPanel")) {
		if(client.classChange)
  		className = "hot";
		
		//Restore side styles to prevent ugly overshoots
		document.getElementById("leftThick").style.height = "";
		document.getElementById("rightThin").style.height = "";
		document.getElementById("rightDouble").style.height = "";
		document.getElementById("rightThick").style.height = "";
			
		if(parseInt(style.height) < CONT_PAN_HEIGHT) {
			style.height = Math.round(CONT_PAN_HEIGHT - (CONT_PAN_HEIGHT - parseInt(style.height))/2) + "px";
			
			if(client.userAgent.indexOf('msie') > -1 && client.appVersion < 7) { //Assuming MS will fix this POS in ver 7
				document.getElementById("contentTop").style.top = "0px";
				document.getElementById("contentBody").style.height = parseInt(style.height) - (parseInt(document.getElementById("contentTop").offsetHeight) + parseInt(document.getElementById("contentBottom").offsetHeight)) + "px";
			}
		}
		if(parseInt(style.width) < CONT_PAN_WIDTH) {
			style.width = Math.round(CONT_PAN_WIDTH - (CONT_PAN_WIDTH - parseInt(style.width))/2) + "px";
		}
		
		if(parseInt(style.height) < CONT_PAN_HEIGHT || parseInt(style.width) < CONT_PAN_WIDTH) {
			setTimeout("ExpandContentPanel()", 30);
		} else {
			//Flag it regular
			if(client.classChange)
  			className = "";
			
			//Grab/Adjust the content panel- this is mainly for IE's benefit.
			if(client.userAgent.indexOf('msie') > -1 && client.appVersion < 7) { //Assuming MS will fix this POS in ver 7
				document.getElementById("contentTop").style.position = "absolute";
				document.getElementById("contentBody").style.position = "absolute";
				document.getElementById("contentBottom").style.position = "absolute";
				style.top = "0px";
				document.getElementById("contentTop").style.top = CONT_PAN_TOP + "px";
				document.getElementById("contentTop").style.width = CONT_PAN_WIDTH + "px";
				document.getElementById("contentBody").style.top = (CONT_PAN_TOP + parseInt(document.getElementById("contentTop").offsetHeight)) + "px";
				document.getElementById("contentBody").style.width = CONT_PAN_WIDTH;
				document.getElementById("contentBody").style.height = CONT_PAN_HEIGHT + "px";
				document.getElementById("contentBottom").style.width = CONT_PAN_WIDTH;
				document.getElementById("contentBottom").style.top = (CONT_PAN_TOP + CONT_PAN_HEIGHT + parseInt(document.getElementById("contentTop").offsetHeight) - 2) + "px";
			} else {
				style.height = "";
				style.width = "";
				style.bottom = "";
				
			}

			//ContentPanel Fully restored!  Restore content
			document.getElementById("content").style.display = SHOW;
			document.getElementById("content").style.visibility = "";
			document.getElementById("content").rightClip = 0;
			
			RestoreContentPanel();

			//Start Sparky
			Sparky();
			
			//Kill the cache div
			document.body.removeChild(cacheDiv);
		}
		
		
	}
}

function SlideBarsIn() {
	for(var i = 0; i < aryTopicBars.length; i++) {
		if(parseInt(aryTopicBars[i].style.left) < UNSEL_BAR_LEFT) {
			aryTopicBars[i].style.left = Math.round(UNSEL_BAR_LEFT - (UNSEL_BAR_LEFT - parseInt(aryTopicBars[i].style.left))/2) + "px";
		} else {
			aryTopicBars[i].childNodes[0].className = "topicBar";
		}
	}

	if(parseInt(aryTopicBars[aryTopicBars.length - 1].style.left) < UNSEL_BAR_LEFT) { //When the last one arrives it's done.
		setTimeout("SlideBarsIn()", 60);
	} else {
		for(var i = 0; i < aryTopicBars.length; i++) {
			aryTopicBars[i].style.display = SHOW;
			aryTopicBars[i].style.visibility = "";
			aryTopicBars[i].childNodes[0].className = "topicBar";
		}
		
		//Promote the selected topic bar!
		promoteTopicBarObj.Promote();
		
		//Append SubTopics
		if(addSubTopicObj) {
			addSubTopicObj.style.display = SHOW;
			addSubTopicObj.style.visibility = "";
			addSubTopicObj.Add();
		}
		
		//Create, delete, and append SubMenu
		if(promoteTopicBarObj.subMenu) {
			promoteTopicBarObj.subMenu.style.display = SHOW;
			promoteTopicBarObj.subMenu.style.visibility = "";
			promoteTopicBarObj.subMenu.Promote();
		}	
				
	}
}

//Globals
var client = null; //Client Object
var xmlDoc = null; //XML Document Object
var loaderStatusDiv = null; //Used for "accessing" et al
var contentArea = null; //Global holder for the content Panel
var startDirContext = String(window.location.href.replace(/\\/gi,"/")).substring(0, window.location.href.replace(/\\/gi,"/").lastIndexOf("/") + 1);
var dirContext = startDirContext;
var currLocation = String(window.location.href).replace("/index.html", "/./index.html");  //Quick hack to fix bars from re-requesting.
var siteRoot = String(document.getElementsByTagName("script")[0].src.substring(0, document.getElementsByTagName("script")[0].src.indexOf("javaScripts")));
var fetchDocURL = null;
var sparkObj = null;
var cacheDiv = null;

//Temporary animation storage globals
var promoteTopicBarObj = null;		//Used to store newly selected topic - used for TopicBarPromote()
var returnTopicBarObj = null;		//Used to store currently selected topic - used for TopicBarReturn()
var addSubTopicObj = null;		//Used to store newly selected subTopic - used for SubTopicAdd()
var removeSubTopicObj = null;		//Used to store currently selected subTopic - used for SubTopicRemove()

//Bar holders
var aryTopicBars = new Array(); //Bar registry - used for selecting items.
	
//Static Globals
var SHOW = "";
var HIDE = "none";

var MARGIN = 3;

var UNSEL_BAR_LEFT = MARGIN;
var UNSEL_BAR_SPACER = 0;
var UNSEL_BAR_TOP_START = 160;
var UNSEL_BAR_WIDTH = 176;
var UNSEL_BAR_HEIGHT = 45;
var UNSEL_BAR_SUB_MENU_SPACER = 10;

var SEL_BAR_TOP = MARGIN;
var SEL_BAR_LEFT = 185;
var SEL_BAR_WIDTH = "auto";
var SEL_BAR_HEIGHT = 45;

var CONT_PAN_TOP = 55;
var CONT_PAN_LEFT = UNSEL_BAR_LEFT + UNSEL_BAR_WIDTH + 10;
var CONT_PAN_WIDTH = "100%";
var CONT_PAN_HEIGHT = "100%";
var CONT_PAN_WIPESTEP = 160;
var CONT_PAN_SPEED = 20;

var TOPICBAR_STEPS = 2;
var TOPICBAR_SPEED = 30;

var SUBTOPIC_TOP = 2;
var SUBTOPIC_SPACER = 16;
var SUBTOPIC_STEP = 7;
var SUBTOPIC_SPEED = 5;

var SUBMENU_DURATION = 750;
var SUBMENU_RIGHT = 12;
var SUBMENU_STEP = 15;
var SUBMENU_SPEED = 5; 

var SPARKY_MINTIME = 0; //Seconds
var SPARKY_MAXTIME = 20; //Seconds
var SPARKY_TIMEOUT = 3000; //1000 = 1 sec
var SPARKY_ARYSPARKS = new Array("interfaceImages/spark1.gif", "interfaceImages/spark2.gif", "interfaceImages/spark3.gif", "interfaceImages/spark4.gif", "interfaceImages/spark5.gif");
var SPARKY_MINSIZE = 16;
var SPARKY_MAXSIZE = 64;


