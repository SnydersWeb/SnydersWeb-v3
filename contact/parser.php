<?php
$blnGoodData = true;

//Test to see if some fartknocker is trying to use an injection exploit.
if(eregi("Content-Transfer-Encoding",$_POST['name'].$_POST['email'].$_POST['phone'].$_POST['message'])){
	$blnGoodData = false;
} else if(eregi("MIME-Version",$_POST['name'].$_POST['email'].$_POST['phone'].$_POST['message'])){
	$blnGoodData = false;
} else if(eregi("Content-Type",$_POST['name'].$_POST['email'].$_POST['phone'].$_POST['message'])){
	$blnGoodData = false;
} else {
	//So far no shenanigans, parse the fields in.
	$name = $_POST['name'];
	$email = $_POST['email'];
	$phone = $_POST['phone'];
	$message = $_POST['message'];
	
	//Clean newline and return characters from single-line fields
	$name = preg_replace( "/\n/", " ", $name );
	$name = preg_replace( "/\r/", " ", $name );
	
	$email = preg_replace( "/\n/", " ", $email );
	$email = preg_replace( "/\r/", " ", $email );
	
	$phone = preg_replace( "/\n/", " ", $phone );
	$phone = preg_replace( "/\r/", " ", $phone );
	
	if(eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $email)) {
		$email = $email;
	} else {
		$email = "";
	}
}

if(!$blnGoodData) {
	$fuckOffSpammer = "<strong>Invalid or corrupt content entered!!\n<br />\n<br />If you are trying an injection exploit, I suggest you try something more productive with your life such as suicide or playing in traffic!\n<br />\n<br />This exploit attempt has been logged!</strong>\n<br />\n<br />";
}
?>
<?php echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<title>SnydersWeb.com - Contact Me</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="icon" href="../favicon.ico" type="image/x-icon" />
	<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
	<script type="text/javascript" src="../javaScripts/generalScripts.js"></script>
	<script type="text/javascript" src="../javaScripts/xmlFunctions.js"></script>
	<script type="text/javascript" src="../javaScripts/topicBarScripts.js"></script>
	<script type="text/javascript" src="../javaScripts/subMenuScripts.js"></script>
	<script type="text/javascript" src="../javaScripts/subTopicScripts.js"></script>
	<script type="text/javascript" src="../javaScripts/initScript.js"></script>
	<style type="text/css">
		@import url("../styleSheets/baseStyle.css");
		@import url("../styleSheets/screenStyle.css");
		@import url("../styleSheets/printStyle.css");
	</style>	
</head>

<body>

<!-- Begin Print Site Logo Div - Outside of circuitBG so it can go behind it.-->
<div id="printLogo"><img src="../interfaceImages/printLogo.gif" width="169" height="160" alt="SnydersWeb" /></div>
<div id="printLogoCover"></div>
<!-- End Print Site Logo Div -->

<div id="circuitBG">
	<!-- Begin Site Logo Div -->
	<div id="logo"><img src="../interfaceImages/logo.gif" width="169" height="145" alt="SnydersWeb" /></div>
	<!-- End Site Logo Div -->
	
	<!-- Begin Selected Topic Bar Area -->
	<div id="selectedBar">
		<div class="topicBar" id="topicBar6">
			<div class="topicBarTop">
				<div class="topicBarTopLeft"></div>
				<div class="topicBarTopMiddle"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarTopRight"></div>
			</div>
			<div class="topicBarBody">
				<div class="topicBarBodyLeft"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBodyMiddle">
					<div class="barText"><a href="./index.html">Contact Me</a></div>
				</div>
				<div class="topicBarBodyRight"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
			</div>
			<div class="topicBarBottom">
				<div class="topicBarBottomLeft"></div>
				<div class="drop"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropBottom"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropTrans"></div>
				<div class="extender"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBottomRight"></div>
			</div>
		</div>
	</div>
	<!-- End Selected Topic Bar Area -->

	<!-- End UnSelected Topic Bar Area -->
	<div id="unSelectedBarArea">
		<div class="topicBar" id="topicBar1">
			<div class="topicBarTop">
				<div class="topicBarTopLeft"></div>
				<div class="topicBarTopMiddle"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarTopRight"></div>
			</div>
			<div class="topicBarBody">
				<div class="topicBarBodyLeft"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBodyMiddle">
					<div class="barText"><a href="../index.html">Home</a></div>
				</div>
				<div class="topicBarBodyRight"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
			</div>
			<div class="topicBarBottom">
				<div class="topicBarBottomLeft"></div>
				<div class="drop"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropBottom"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropTrans"></div>
				<div class="extender"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBottomRight"></div>
			</div>
		</div>
		
		<div class="topicBar" id="topicBar2">
			<div class="topicBarTop">
				<div class="topicBarTopLeft"></div>
				<div class="topicBarTopMiddle"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarTopRight"></div>
			</div>
			<div class="topicBarBody">
				<div class="topicBarBodyLeft"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBodyMiddle">
					<div class="barText"><a href="../aboutMe/index.html">About Me</a></div>
				</div>
				<div class="topicBarBodyRight"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
			</div>
			<div class="topicBarBottom">
				<div class="topicBarBottomLeft"></div>
				<div class="drop"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropBottom"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropTrans"></div>
				<div class="extender"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBottomRight"></div>
			</div>
		</div>
			
		<div class="topicBar" id="topicBar3">
			<div class="topicBarTop">
				<div class="topicBarTopLeft"></div>
				<div class="topicBarTopMiddle"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarTopRight"></div>
			</div>
			<div class="topicBarBody">
				<div class="topicBarBodyLeft"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBodyMiddle">
					<div class="barText"><a href="../webSites/index.html">Web Sites</a></div>
				</div>
				<div class="topicBarBodyRight"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
			</div>
			<div class="topicBarBottom">
				<div class="topicBarBottomLeft"></div>
				<div class="drop"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropBottom"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropTrans"></div>
				<div class="extender"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBottomRight"></div>
			</div>
		</div>

		<div class="topicBar" id="topicBar4">
			<div class="topicBarTop">
				<div class="topicBarTopLeft"></div>
				<div class="topicBarTopMiddle"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarTopRight"></div>
			</div>
			<div class="topicBarBody">
				<div class="topicBarBodyLeft"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBodyMiddle">
					<div class="barText"><a href="../portfolio/index.html">Art Portfolio</a></div>
				</div>
				<div class="topicBarBodyRight"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
			</div>
			<div class="topicBarBottom">
				<div class="topicBarBottomLeft"></div>
				<div class="drop"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropBottom"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropTrans"></div>
				<div class="extender"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBottomRight"></div>
			</div>
		</div>

		<div class="topicBar" id="topicBar5">
			<div class="topicBarTop">
				<div class="topicBarTopLeft"></div>
				<div class="topicBarTopMiddle"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarTopRight"></div>
			</div>
			<div class="topicBarBody">
				<div class="topicBarBodyLeft"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBodyMiddle">
					<div class="barText"><a href="../destinations/index.html">Destinations</a></div>
				</div>
				<div class="topicBarBodyRight"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
			</div>
			<div class="topicBarBottom">
				<div class="topicBarBottomLeft"></div>
				<div class="drop"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropBottom"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="dropTrans"></div>
				<div class="extender"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div class="topicBarBottomRight"></div>
			</div>
		</div>
		
	</div>
	<!-- End UnSelected Topic Bar Area -->

	<!-- Begin Content Window -->
	<div id="contentPanel">
		<div id="contentTop">
			<div id="contentTopLeft"></div>
			<div id="contentTopLeftInner"></div>
			<div id="contentTopMiddle"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
			<div id="contentTopRightInner"></div>
			<div id="contentTopRight"></div>
		</div>
		<div id="contentBody">
			<div id="contentBodyLeft">
				<div id="leftTop"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div id="leftThick"></div>
				<div id="leftTrans"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div id="leftDouble"></div>
				<div id="leftDoubleEnd"></div>
			</div>
			<!-- Begin Page Content -->
			<div id="contentArea">
				<div id="content" class="bodyText">

<div id="subMenuGapper"></div>

<!-- Begin Breadcrumb Area -->
<span class="breadCrumbHist"><a href="../index.html">Home</a> : </span>
<span class="breadCrumbCurrent"><a href="index.html">Contact Me</a></span>
<!-- End Breadcrumb Area -->
<br /><br />


<h1>Contact Me</h1>
<?php
if(!$blnGoodData) {
	echo $fuckOffSpammer;
}

if($name == "" || $email == "" || $message == "") {
?>
<form action="http://www.snydersweb.com/contact/parser.php" method="post" onsubmit="return CheckData(this)">
<fieldset title="Contact Information">
<legend>Contact Information</legend>
	<div class="formLine">
		<div class="fieldLabel">
			<label for="name">Name: </label>
		</div>
		<div class="fieldBox">
			<input id="name" name="name" type="text" value="<?php echo $name ?>" size="30" maxlength="75" />*
		</div>
		<div class="errMsg"><?php echo ($name == "") ? "Please enter your name" : "" ?></div>
	</div>
	<div class="formLine">
		<div class="fieldLabel">
			<label for="email">Email Address: </label>
		</div>
		<div class="fieldBox">
			<input id="email" name="email" type="text" value="<?php echo $email ?>" size="30" maxlength="75" />*
		</div>
		<div class="errMsg"><?php echo ($email == "") ? "Please enter your email address" : "" ?></div>
	</div>
	<div class="formLine">
		<div class="fieldLabel">
			<label for="phone">Phone Number: </label>
		</div>
		<div class="fieldBox">
			<input id="phone" name="phone" type="text" value="<?php echo $phone ?>" size="30" maxlength="75" />
		</div>
		<div class="errMsg"></div>
	</div>
</fieldset>
	
<fieldset title="Message">
<legend>Message</legend>
	<div class="formLine">
		<div class="fieldLabel">
			<label for="message">Message: </label>
		</div>
		<div class="fieldBox">
			<textarea rows="7" cols="40" id="message" name="message"><?php echo $message ?> </textarea>*
		</div>
		<div class="errMsg"><?php echo ($message == "") ? "Please enter a message" : "" ?></div>
	</div>
</fieldset>

<div>
<input type="submit" value="Submit Contact" /> <input type="reset" />
</div>

</form>
<?php
} else { //Output the form
?>
	Thank you, <?php echo $name ?><br /><br />
	I appreciate your contact.<br /><br />

<?php
	//Send the email
	$to = "webFeedback@SnydersWeb.com";
	$subject = "Feedback from website";
	$body = "From: $name\r\nEmail: $email\r\nPhone: $phone\r\n\r\n$message";   
	$extra = "From:$name<$email>\r\nReply-To:$email\r\n";   
	
	if (mail($to, $subject, $body, $extra)) {
	   echo("Message successfully sent!<br /><br />\n\n");
	} else {
	   echo("Message delivery failed...<br /><br />\n\n");
	}
}
?>
<br /><br />
				<div class="clearAll"></div><br />
				<a href="http://validator.w3.org/check?uri=referer"><img src="http://www.w3.org/Icons/valid-xhtml10" alt="Valid XHTML 1.0!" height="31" width="88" /></a> <a href="http://jigsaw.w3.org/css-validator/check/referer"><img src="http://jigsaw.w3.org/css-validator/images/vcss" alt="Valid CSS!" height="31" width="88" /></a>
				<br /><br />
			
				</div>
			</div>
			<!-- End Page Content -->
			<div id="contentBodyRight">
				<div id="rightThin"></div>
				<div id="rightDoubleEnd"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div id="rightDouble"></div>
				<div id="rightTrans"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
				<div id="rightThick"></div>
				<div id="rightBottom"></div>
			</div>
		</div>
		<div id="contentBottom">
			<div id="contentBotLeft"></div>
			<div id="contentBotLeftInner"></div>
			<div id="contentBotMiddle"><img src="../interfaceImages/spacer.gif" width="1" height="1" alt="" /></div>
			<div id="contentBotRightInner"></div>
			<div id="contentBotRight"></div>
		</div>
	</div>	
	<!-- End Content Window -->
	
</div>

<script type="text/javascript">
InitInterface();
</script>

</body>
</html>