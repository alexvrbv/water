<?php

// Необходимые HTTP-заголовки 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: 'POST, GET, PUT, OPTIONS, DELETE'");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'");

// Подключаем класс
include_once '../objects/Form.php';
use Form\Form;

// Подготовка данных
$_POST = json_decode(file_get_contents('php://input'), true);

// Подготовка объекта формы
$form = new Form();

// Прописываем данные фомы в свойство dat
$form->data = isset($_POST) ? $_POST : die();

// Сохранение данных формы
$form->saveFormData();