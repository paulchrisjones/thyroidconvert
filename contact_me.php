<?php
	
$email = $_POST['email'];
$message = $_POST['message'];
	
// Create the email and send the message
$to = 'greyshark7@hotmail.com'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
$email_subject = "New message from ThyroidConvert.com";
$email_body = "Email: $email  \nMessage: $message \n\nPress 'reply' to respond to the sender.";
$headers = "From: noreply@paulchrisjones.com\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$headers .= "Reply-To: $email";	
mail($to,$email_subject,$email_body,$headers);
return true;			
?>