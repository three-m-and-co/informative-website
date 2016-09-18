<?php

/*
 * Copyright (c) 2013 Alex Wilson <alex@uq.edu.au>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

require_once "libkv.php";

define('KVD_SERVER', '172.23.84.20');
define('KVD_COOKIE', 'EAIT_WEB');
define('REDIR_BASE', 'https://api.uqcloud.net/login/');

function auth_redirect() {
  $target = REDIR_BASE;
  if (!isset($_SERVER['HTTPS']) || strtolower($_SERVER['HTTPS']) == 'off') 
    $target .= "http://";
  else
    $target .= "https://";
  $target .= $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
  header('HTTP/1.0 302 Found');
  header('Location: ' . $target);
  die();
}

function auth_get_payload() {
  global $_auth_payload;
  if (isset($_auth_payload)) {
    return $_auth_payload;
  }
  if (isset($_COOKIE[KVD_COOKIE])) {
    if (isset($_SERVER['HTTP_X_KVD_PAYLOAD'])) {
      return json_decode($_SERVER['HTTP_X_KVD_PAYLOAD'], true);
    } else {
      $payload = kv_get_bucket($_COOKIE[KVD_COOKIE], $_SERVER['HTTP_HOST'], KVD_SERVER);
      if ($payload) {
        $_auth_payload = json_decode($payload, true);
        return $_auth_payload;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

function auth_is_member($group) {
  $payload = auth_get_payload();
  if ($payload === false)
    return false;
  return in_array($group, $payload["groups"]);
}

function auth_is_user($user) {
  $payload = auth_get_payload();
  if ($payload === false)
    return false;
  return ($payload["user"] === $user);
}

function auth_require() {
  if (auth_get_payload() === false) {
    auth_redirect();
  }
}

function auth_require_member($group) {
  $payload = auth_get_payload();
  if ($payload === false)
    auth_redirect();
  if (!in_array($group, $payload["groups"])) {
    header('HTTP/1.0 403 Forbidden');
    die();
  }
}

function auth_require_user($user) {
  $payload = auth_get_payload();
  if ($payload === false)
    auth_redirect();
  if ($payload["user"] !== $user) {
    header('HTTP/1.0 403 Forbidden');
    die();
  }
}
