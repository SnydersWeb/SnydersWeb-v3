//=================================================================
// JavaScript IE5/Mozilla XML Wrapper
// Version 1.0
// by Nicholas C. Zakas, nicholas@nczonline.net
// Copyright (c) 2002 Nicholas C. Zakas.  All Rights Reserved.
//-----------------------------------------------------------------
// Browsers Supported:
//	* Mozilla 0.9.2+ (Netscape 6+)
//  * Internet Explorer 5.0+
//=================================================================
// History
//-----------------------------------------------------------------
// January 30, 2002 (Version 1.0)
//  - Works in Netscape 6.0+ and IE 5.0+  
//=================================================================
// Software License
// Copyright (c) 2002 Nicholas C. Zakas.  All Rights Reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer. 
//
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in
//    the documentation and/or other materials provided with the
//    distribution.
//
// 3. The end-user documentation included with the redistribution,
//    if any, must include the following acknowledgment:  
//       "This product includes software developed by the
//        Nicholas C. Zakas (http://www.nczonline.net/)."
//    Alternately, this acknowledgment may appear in the software itself,
//    if and wherever such third-party acknowledgments normally appear.
//
// 4. Redistributions of any form are free for use in non-commercial
//    ventures. If intent is to use in a commercial product, contact
//    Nicholas C. Zakas at nicholas@nczonline.net for purchasing of
//    a commercial license.
//
// THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
// OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED.  IN NO EVENT SHALL NICHOLAS C. ZAKAS  BE LIABLE FOR ANY 
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE 
// GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER 
// IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
// OF THE POSSIBILITY OF SUCH DAMAGE.
//-----------------------------------------------------------------
// Any questions, comments, or suggestions should be e-mailed to 
// nicholas@nczonline.net.  For more information, please visit
// http://www.nczonline.net/. 
//=================================================================

//Possible prefixes ActiveX strings for DOM DOcument
var ARR_ACTIVEX = ["MSXML4.DOMDocument", "MSXML3.DOMDocument", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XmlDom"];

//When the proper prefix is found, store it here
var STR_ACTIVEX = "";

//browser detection
var isIE = navigator.userAgent.toLowerCase().indexOf("msie") > -1;
var isMoz = document.implementation && document.implementation.createDocument;

//-----------------------------------------------------------------
// IE Initialization
//-----------------------------------------------------------------

//if this is IE, determine which string to use
if (isIE) {
    //define found flag
    var bFound = false;
    
    //iterate through strings to determine which one to use (NCZ, 1/30/02)
    for (var i=0; i < ARR_ACTIVEX.length && !bFound; i++) {
    
        //set up try...catch block for trial and error of strings (NCZ, 1/30/02)
        try {
        
            //try to create the object, it will cause an error if it doesn't work (NCZ, 1/30/02)
            var objXML = new ActiveXObject(ARR_ACTIVEX[i]);
            
            //if it gets to this point, the string worked, so save it and return
            //the DOM Document (NCZ, 1/30/02)
            STR_ACTIVEX = ARR_ACTIVEX[i];
            bFound = true                
        
        } catch (objException) { 
        } //End: try
    } //End: for

    //if we didn't find the string, send an error (NCZ, 1/30/02)
    if (!bFound)
       throw "No DOM DOcument found on your computer."

} //End: if

//-----------------------------------------------------------------
// Mozilla Initialization
//-----------------------------------------------------------------
if (isMoz) {
    
    //add the loadXML() method to the Document class
    Document.prototype.loadXML = function(strXML) {
    
        //change the readystate
        changeReadyState(this, 1);

        //create a DOMParser
        var objDOMParser = new DOMParser();
        
        //create new document from string
        var objDoc = objDOMParser.parseFromString(strXML, "text/xml");
        
        //make sure to remove all nodes from the document
		while (this.hasChildNodes())
			this.removeChild(this.lastChild);
            
        //add the nodes from the new document
        for (var i=0; i < objDoc.childNodes.length; i++) {
            
            //import the node
            var objImportedNode = this.importNode(objDoc.childNodes[i], true);
            
            //append the child to the current document
            this.appendChild(objImportedNode);
        
        } //End: for
        
        //we can't fire the onload event, so we fake it
        handleOnLoad(this);
        
    } //End: function
    
    //add the getter for the .xml attribute
    Node.prototype.__defineGetter__("xml", _Node_getXML);
    
    //add the readystate attribute for a Document
    Document.prototype.readyState = "0";
    
    //save a reference to the original load() method
    Document.prototype.__load__ = Document.prototype.load;

    //create our own load() method
    Document.prototype.load = _Document_load;
    
    //add the onreadystatechange attribute
    Document.prototype.onreadystatechange = null;
    
    //add the parseError attribute
    Document.prototype.parseError = 0;
    
} //End: if


//-----------------------------------------------------------------
// Factory jsXML
//-----------------------------------------------------------------
// Author(s)
//  Nicholas C. Zakas (NCZ), 1/30/02
//
// Description
//  This factory will serve as the entry point for other XML-related
//  implementations.
//
// Parameters
//  (none)
//-----------------------------------------------------------------
function jsXML() { }

//-----------------------------------------------------------------
// Function jsXML.createDocument()
//-----------------------------------------------------------------
// Author(s)
//  Nicholas C. Zakas (NCZ), 1/30/02
//
// Description
//  This function creates a XML Document according to which browser
//  is being used.
//
// Parameters
//  strNamespaceURI (String) - the namespace for this document (optional).
//  strRootTagName (String) - the tag name for the documentElement (optional).
//
// Returns
//  The XML Document object that was created.
//-----------------------------------------------------------------
jsXML.createDOMDocument = function(strNamespaceURI, strRootTagName) {

    //variable for the created DOM Document
    var objDOM = null;
    
    //determine if this is a standards-compliant browser like Mozilla
    if (isMoz) {
    
        //create the DOM Document the standards way
        objDOM = document.implementation.createDocument(strNamespaceURI, strRootTagName, null);    
    
        //add the event listener for the load event
        objDOM.addEventListener("load", _Document_onload, false);
        
    } else if (isIE) {
    
        //create the DOM Document the IE way
        objDOM = new ActiveXObject(STR_ACTIVEX);

        //if there is a root tag name, we need to preload the DOM
        if (strRootTagName) {
       
            //If there is both a namespace and root tag name, then
            //create an artifical namespace reference and load the XML.  
            if (strNamespaceURI) {
                objDOM.loadXML("<a0:" + strRootTagName + " xmlns:a0=\"" + strNamespaceURI + "\" />");
            } else {
                objDOM.loadXML("<" + strRootTagName + "/>");        
            }
        
        }
    }
    
    //return the object
    return objDOM;
}

//-----------------------------------------------------------------
// Functon _Node_getXML()
//-----------------------------------------------------------------
// Author(s)
//  Nicholas C. Zakas (NCZ), 2/23/02
//
// Description
//  This is the attribute getter for the .xml attribute.
//
// Parameters
//  (none)
//
// Returns
//  A string with the XML of the Node calling this function.
//-----------------------------------------------------------------
function _Node_getXML() {
    
    //create a new XMLSerializer
    var objXMLSerializer = new XMLSerializer;
    
    //get the XML string
    var strXML = objXMLSerializer.serializeToString(this);
    
    //return the XML string
    return strXML;
}


//-----------------------------------------------------------------
// Function _Document_load()
//-----------------------------------------------------------------
// Author(s)
//  Nicholas C. Zakas (NCZ), 2/24/02
//
// Description
//  This function replaces the native load() method to allow for
//  readyState changes.
//
// Parameters
//  strURL (String) - The XML file to load.
//
// Returns
//  (nothing)
//-----------------------------------------------------------------
function _Document_load(strURL) {

    //set the parseError to 0
    this.parseError = 0;

    //change the readyState
    changeReadyState(this, 1);
    
    //watch for errors
    try {
        //call the original load method
        this.__load__(strURL);
        
    } catch (objException) {
    
        //set the parseError attribute
        this.parseError = -9999999;
        
        //change the readystate
        changeReadyState(this, 4);

    } // End: try...catch
}

//-----------------------------------------------------------------
// Function _Document_onload()
//-----------------------------------------------------------------
// Author(s)
//  Nicholas C. Zakas (NCZ), 2/24/02
//
// Description
//  This function is the event handler for the load event.
//
// Parameters
//  (none)
//
// Returns
//  (nothing)
//-----------------------------------------------------------------
function _Document_onload() {

    //handle the onload event
    handleOnLoad(this);
}

//-----------------------------------------------------------------
// Function handleOnLoad()
//-----------------------------------------------------------------
// Author(s)
//  Nicholas C. Zakas (NCZ), 2/24/02
//
// Description
//  This function handles the load event on the Document object.
//
// Parameters
//  objDOMDocument (Document) - the DOM Document object that has been loaded.
//
// Returns
//  (nothing)
//-----------------------------------------------------------------
function handleOnLoad(objDOMDocument) {
    //check for a parsing error
    if (!objDOMDocument.documentElement || objDOMDocument.documentElement.tagName == "parsererror")
        objDOMDocument.parseError = -9999999;

    //change the readyState
    changeReadyState(objDOMDocument, 4);
}

//-----------------------------------------------------------------
// Function changeReadyState()
//-----------------------------------------------------------------
// Author(s)
//  Nicholas C. Zakas (NCZ), 2/24/02
//
// Description
//  This function changes the readyState of a Document to the desired
//  state and runs any event handler the user has assigned.
//
// Parameters
//  objDOMDocument (Document) - the DOM Document object that has been loaded.
//  iReadyState (int) - the readyState to set the DOM Document to.
//
// Returns
//  (nothing)
//-----------------------------------------------------------------
function changeReadyState(objDOMDocument, iReadyState) {

    //change the readyState
    objDOMDocument.readyState = iReadyState;
    
    //if there is an onreadystatechange event handler, run it
    if (objDOMDocument.onreadystatechange != null && typeof objDOMDocument.onreadystatechange == "function")
        objDOMDocument.onreadystatechange();
}