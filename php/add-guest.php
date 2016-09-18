<?php

$email = $_POST['email'];
$firstName = $_POST['firstname'];
$lastName = $_POST['lastname'];
$department = $_POST['department'];
$jobTitle = $_POST['jobtitle'];
if(isset($_POST['newsletter']))
{
$updateRequested = 1;
}
else
{
    $updateRequested = 0;
}
$phone = $_POST['phone'];
$date = date('Y-m-d H:i:s');

$servername = "localhost";
$username = "user";
$password = "password";
$database = "threem";
$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
} 

$addQuery = "INSERT INTO Guest VALUES ('$email', '$firstName', '$lastName', '$department', '$jobTitle', '$phone', '$updateRequested', '$date');";
$result = $conn->query($addQuery);
$conn->close();
header('location: /index.html');
?>