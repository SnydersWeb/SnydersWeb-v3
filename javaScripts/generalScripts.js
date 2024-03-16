/*
	All scripts and graphics on this web site (c) 2007 David Snyder 
*/

function FixLink(hyperLink) {
	try {
		//alert(window.location.host + "\nhref:" + hyperLink.getAttribute("href") + "\nhttp:" + hyperLink.getAttribute("href").search(/http/i) + "\nJS:" + hyperLink.getAttribute("href").search(/JavaScript\:/i) + "\nJPG:" + hyperLink.getAttribute("href").search(/\.jpg/i) + "\nGIF:" + hyperLink.getAttribute("href").search(/\.gif/i));
		if(hyperLink.getAttribute("href").search(/http/i) < 0 && hyperLink.getAttribute("href").search(/JavaScript\:/i) < 0 && hyperLink.getAttribute("href").search(/\.jpg/i) < 0 && hyperLink.getAttribute("href").search(/\.mpg/i) < 0 && hyperLink.getAttribute("href").search(/\.gif/i) < 0 && hyperLink.getAttribute("href").search(/mailto/i) < 0) {
			if(dirContext != startDirContext) {
				hyperLink.setAttribute("href","JavaScript:FetchContent('" + dirContext + hyperLink.getAttribute("href") + "')");
			} else {
				hyperLink.setAttribute("href","JavaScript:FetchContent('" + hyperLink.getAttribute("href") + "')");
			}
		} else if(hyperLink.getAttribute("href").search(/\.jpg/i) > -1 || hyperLink.getAttribute("href").search(/\.gif/i) > -1 || hyperLink.getAttribute("href").search(/\.mpg/i) > -1) {
			if(dirContext != startDirContext) {
				hyperLink.setAttribute("href", "JavaScript:ShowShot('" + dirContext + hyperLink.getAttribute("href") + "', 'screen_shot', true, 'auto', 'auto')");
			} else {
				hyperLink.setAttribute("href", "JavaScript:ShowShot('" + hyperLink.getAttribute("href") + "', 'screen_shot', true, 'auto', 'auto')");
			}
		} else if(hyperLink.getAttribute("href").search(window.location.host) > 0 && hyperLink.getAttribute("href").search(/w3\.org/i) == -1) {
			//Quick hack because IE likes reading more into a hyperlink than what's actually there - only happens on home... GRUMBLE!
			hyperLink.setAttribute("href","JavaScript:FetchContent('" + hyperLink.getAttribute("href") + "')");
		} else if(hyperLink.getAttribute("href").search(/http/i) > -1) {
			hyperLink.setAttribute("target", "_blank");
		}
	} catch(e) {
		//alert(e + "\n" + e.description);
	}

	return hyperLink;
}

function SetLocationCookie() {
	var expires = new Date();
	expires.setTime(expires.getTime()) // + 1000*60*60*24*60);
	//document.cookie = "contentURL=" + escape(fetchDocURL) + "; domain=www.SnydersWeb.com; expires=" + expires.toGMTString();
	document.cookie = "contentURL=; expires=" + expires.toGMTString() + "; path=/";
	document.cookie = "contentURL=" + escape(fetchDocURL) + "; path=/";
}

function FetchLocationCookie() {
	var snydersWebCookie = document.cookie;
	var cookieVal = "";
	//alert(snydersWebCookie);
	if(snydersWebCookie.indexOf("contentURL=") >= 0) {
		if(snydersWebCookie.indexOf(";", snydersWebCookie.indexOf("contentURL=")) < 0) {
			cookieVal = unescape(snydersWebCookie.substring(snydersWebCookie.indexOf("contentURL=") + String("contentURL=").length, snydersWebCookie.length));
		} else {
			cookieVal = unescape(snydersWebCookie.substring(snydersWebCookie.indexOf("contentURL=") + String("contentURL=").length, snydersWebCookie.indexOf(";", snydersWebCookie.indexOf("contentURL="))));
		}
		
		//Quick check for those who visited the beta-site
		if(cookieVal.indexOf("newSite") > 0)
			cookieVal = "";
	}
	return cookieVal;
}

function FetchContent(contentHref) {
	if(contentHref.search("/") > 0) {
		dirContext = contentHref.substring(0,contentHref.lastIndexOf("/") + 1);
	}
	
	if(client.userAgent.search(/msie/) != -1) {
		fetchDocURL = dirContext + contentHref.substring(contentHref.lastIndexOf("/") + 1, contentHref.length);
	} else {
		if(startDirContext != dirContext) {
			fetchDocURL = startDirContext + dirContext + contentHref.substring(contentHref.lastIndexOf("/") + 1, contentHref.length);
		} else {
			fetchDocURL = dirContext + contentHref.substring(contentHref.lastIndexOf("/") + 1, contentHref.length);
		}
	}

	//Filter out ./ and ../ - set for proper URL
	aryFetchDoc = fetchDocURL.split("/");
	fetchDocURL = "";
	
	for(var i = (aryFetchDoc.length - 1); i >= 0; i--) {
		if(aryFetchDoc[i] == "..") {
			i--;
		} else if(aryFetchDoc[i] != ".") {
			fetchDocURL = aryFetchDoc[i] + "/" + fetchDocURL;
		}
	}
	
	//Trim off trailing /
	fetchDocURL = fetchDocURL.substring(0, fetchDocURL.length - 1);
	
	//Debugging code
	//alert("fetchDocURL: " + fetchDocURL + "\ncontentHref: " + contentHref + "\nstartDirContext: " + startDirContext + "\ndirContext: " + dirContext + "\ndocument: " + contentHref.substring(contentHref.lastIndexOf("/") + 1, contentHref.length));
		
	if(currLocation != fetchDocURL) { //Only if URLs change
		//Set currLocation;
		currLocation = String(fetchDocURL);
		
		//Clear Content Panel
		ClearContentPanel();
		
		SetLocationCookie();
	}
}

function ClearContentPanel() {
	if(contentArea.rightClip > 0) {
		contentArea.rightClip = contentArea.rightClip - CONT_PAN_WIPESTEP;
		contentArea.style.clip = "rect(auto " + contentArea.rightClip + "px auto auto)";
		contentArea.timeOut = setTimeout("ClearContentPanel()", CONT_PAN_SPEED);
	} else {
		contentArea.rightClip = 0;
		clearTimeout(contentArea.timeOut);
		contentArea.innerHTML = "";
		
		//Content Area Cleared, now let's get the content!
		GetExternalDocument(fetchDocURL);
	}
}

function RestoreContentPanel() {
	if(contentArea.rightClip < contentArea.offsetWidth) {
		contentArea.rightClip = contentArea.rightClip + CONT_PAN_WIPESTEP;
		contentArea.style.clip = "rect(auto " + contentArea.rightClip + "px auto auto)";
		contentArea.timeOut = setTimeout("RestoreContentPanel()", CONT_PAN_SPEED);
	} else {
		contentArea.style.clip = "rect(auto auto auto auto)";
		contentArea.rightClip = contentArea.offsetWidth;
		clearTimeout(contentArea.timeOut);
	}
}

function HandleResize() { //Adjust widths.
	if(client.userAgent.indexOf('msie')!=-1) {
		client.width = document.body.clientWidth;
		client.height = document.body.clientHeight;

		promoteTopicBarObj.style.width = SEL_BAR_WIDTH + "px";
		
		document.getElementById("contentTop").style.top = CONT_PAN_TOP + "px";
		document.getElementById("contentTop").style.width = CONT_PAN_WIDTH + "px";
		document.getElementById("contentBody").style.top = (CONT_PAN_TOP + parseInt(document.getElementById("contentTop").offsetHeight)) + "px";
		document.getElementById("contentBody").style.width = CONT_PAN_WIDTH;
		document.getElementById("contentBody").style.height = CONT_PAN_HEIGHT + "px";
		document.getElementById("contentBottom").style.width = CONT_PAN_WIDTH;
		document.getElementById("contentBottom").style.top = (CONT_PAN_TOP + CONT_PAN_HEIGHT + parseInt(document.getElementById("contentTop").offsetHeight) - 2) + "px";
		
	} else { 	
		client.width = window.innerWidth;
		client.height = window.innerHeight;
	}

	SEL_BAR_WIDTH = client.width - (SEL_BAR_LEFT + MARGIN);
	CONT_PAN_WIDTH = client.width - CONT_PAN_LEFT;
	CONT_PAN_HEIGHT = client.height - (CONT_PAN_TOP + MARGIN + MARGIN + parseInt(document.getElementById("contentBottom").offsetHeight) + parseInt(document.getElementById("contentTop").offsetHeight));
}

function Sparky() {
	with(sparkObj) {
		if(timeOut == 0) {
			style.display = SHOW;
			style.visibility = "";
			style.left = 0 + Math.round(Math.random() * client.width) + "px";
			style.top = 0 + Math.round(Math.random() * client.height) + "px";
			style.zIndex = SPARKY_MINSIZE + Math.round(Math.random() * 5);
			var size = 0 + Math.round(Math.random() * SPARKY_MAXSIZE);
			spark = appendChild(document.createElement("img"));
			spark.height = size;
			spark.width = size;
			spark.src = document.getElementsByTagName("script")[0].src.substring(0, document.getElementsByTagName("script")[0].src.indexOf("javaScripts")) + SPARKY_ARYSPARKS[0 + Math.round(Math.random() * (SPARKY_ARYSPARKS.length - 1))];
			timeOut = setTimeout("Sparky()", SPARKY_TIMEOUT);
		} else if(style.display == SHOW){
			style.display = HIDE;
			style.visibility = "hidden";
			removeChild(spark);
			timeOut = 0;
			setTimeout("Sparky()", (1000 * SPARKY_MINTIME) + Math.round(Math.random() * (1000 * SPARKY_MAXTIME)));
		}
	}
}

//ShowShot - used for "click to enlarge" type stuff.
function ShowShot(url, name, rs, w, h) {
	//alert("SHOWSHOT\n" + url);
	var resize = "";
	if (rs) {
		resize = "resizable,";
	}
	if(w == "auto") {
		w = client.width/2;
	}
	if(h == "auto") {
		h = client.height/2;
	}
	window.open(url, name, "scrollbars=yes,menubar=no," + resize + "width=" + w + ",height=" + h);
}


//From related functions
function CheckFreeText(formField, intMinLength, strErrMsg) {
	var fieldVal = formField.value;
	
	if (fieldVal.length < intMinLength) {
		if(bGoodSubmit)	
			formField.focus();
				
		bGoodSubmit = false;
		try {
			formField.className = "err";
			formField.parentNode.parentNode.getElementsByTagName("div")[2].innerHTML = strErrMsg;
		} catch(err) {
			alert(strErrMsg);
		}
	} else {
		try {
			formField.className = "";
			formField.parentNode.parentNode.getElementsByTagName("div")[2].innerHTML = "";
		} catch(err) {}
	}
}

function CheckNumber(formField, intMinLength, strErrMsg) {
	var bErrorFlag = false;
	
	var fieldVal = formField.value;
	
	if (fieldVal.length >= intMinLength) {
		//Use regular expression to find anything !0-9
		if(fieldVal.search(/\D/) != -1) {
			bErrorFlag = true;
			stErrMsg = "Please enter a numeric value only";
		}
	} else {
		bErrorFlag = true;
	}
	
	if (bErrorFlag) {
		if(bGoodSubmit)	
			formField.focus();
				
		bGoodSubmit = false;
		try {
			formField.className = "err";
			formField.parentNode.parentNode.getElementsByTagName("div")[2].innerHTML = strErrMsg;
		} catch(err) {
			alert(strErrMsg);
		}
	} else { //Clear error
		try {
			formField.className = "";
			formField.parentNode.parentNode.getElementsByTagName("div")[2].innerHTML = "";
		} catch(err) {}
	}
}

function CheckDropDown(formField, strErrMsg) {
	var selIndex = formField.selectedIndex;
	
	if (formField.options[selIndex].value == "X") {
		if(bGoodSubmit)	
			formField.focus();
				
		bGoodSubmit = false;
		try {
			formField.className = "err";
			formField.parentNode.parentNode.getElementsByTagName("div")[2].innerHTML = strErrMsg;
		} catch(err) {
			alert(strErrMsg);
		}
	} else { //Clear error
		try {
			formField.className = "";
			formField.parentNode.parentNode.getElementsByTagName("div")[2].innerHTML = "";
		} catch(err) {}
	}
}

function CheckEmail(addrField) {
	var addrValue = addrField.value;
	var sign = addrValue.indexOf("@");
	var before = addrValue.substring(0,sign);
	var after = addrValue.substring(sign+1,addrValue.length);
	var lower = after.toLowerCase();
	var coma = before.indexOf(",");
	var period = after.indexOf(".");
	berrorFlag = false;
	errTxt = "";
	
	//alert(addrValue + "\n sign=" + sign + "\n after=" + after + "\n period=" + period);
       while (!berrorFlag) {
       	if (sign == 0) {
			errTxt = "User name is missing before the @."; 
			berrorFlag = true; 
			break;
		} else if (sign == -1) {
			errTxt = "You need an @ somewhere in the address."; 
			berrorFlag = true; 
			break;
		} else if (sign==(name.length-1)) {
			errTxt = "Missing host name after the @."; 
			berrorFlag = true; 
			break;
		} else if (period == -1) {
			errTxt = "You need a period in the second part of the address"; 
			berrorFlag = true; 
			break;
		} else {
			break;
  		}	
	}
	if (berrorFlag){
		if(bGoodSubmit)	
			addrField.focus();
				
		bGoodSubmit = false;
		try {
			addrField.className = "err";
			addrField.parentNode.parentNode.getElementsByTagName("div")[2].innerHTML = errTxt;
		} catch(err) {
			alert(errTxt);
		}
	} else {
		try {
			addrField.className = "";
			addrField.parentNode.parentNode.getElementsByTagName("div")[2].innerHTML = "";
		} catch(err) {}
	}	

}

function GetFormValues(formObj) {
	var strForm = "";

	for(var i = 0;i < formObj.elements.length;i++) {
		//alert("Name: " + formObj.elements[i].name + "\nType: " + formObj.elements[i].type + "\nValue: " + escape(formObj.elements[i].value));
		switch(formObj.elements[i].type) {
			case "text":
				strForm += formObj.elements[i].name + "=" + escape(formObj.elements[i].value) + "&";
				break;
	
			case "textarea":
				strForm += formObj.elements[i].name + "=" + escape(formObj.elements[i].value) + "&";
				break;

			case "select-one":
				strForm += formObj.elements[i].name + "=" + formObj.elements[i].options[formObj.elements[i].selectedIndex].value + "&";
				break;
		}
	
	}
	
	strForm = strForm.substring(0, (strForm.length - 1));
	return strForm;
}
	
function CheckData(theForm) {
	//Set Good Submit
	bGoodSubmit = true;
	
	CheckFreeText(theForm.name, 2, "Please enter your name");
	CheckEmail(theForm.email);
	CheckFreeText(theForm.message, 2, "Please enter a message");

	//Optional - commented out for now.
	//CheckNumber(theForm.homePhone, 2, "Please Enter a valid phone number");
	//CheckState(theForm.state, theForm.country, theForm.otherState, 2, "Please specify your state/province.");
	
	if(!bGoodSubmit) {
		return false;
	}

	if (bGoodSubmit) {
		try {
			//alert(window.location.protocol);
			if(client.xmlHttp && window.location.protocol.search(/http/) > -1) { //Send via XML object.
				theForm.action = "";
				
				//if SendXML returns false, it failed - returning true will do a traditional form post.
				if(!SendXML(GetFormValues(theForm), "http://www.snydersweb.com/contact/parser.php")) {
					statusTxt = "Sending via regular form post";
					theForm.message += "\n\nFailover!";
					XMLLoadAnim(statusTxt);
					return true;
				} else {
					return false;
				}
			} else if(client.xmlHttp && window.location.protocol.search(/http/) == -1) { //Accessing site through local file access.
				alert("Thank you, this form will be transmitted through the live web site and return back to the contact me form there");
				return true;
			} else { //Send normal
				return true;
			}
		} catch(err) { //all else fails, send direct.
			return true;
		}
	}	
}

function BarfIE7() {
  client.classChange = true;
  FetchContent(document.getElementById("topicBar5").contentLink);
}
