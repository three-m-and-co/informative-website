<?php

function runTest() {
    return "This is a test";
}

function authUser() {

    require_once "auth.php";
    auth_require();
    return "done";
}

?>