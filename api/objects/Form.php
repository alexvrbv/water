<?php

namespace Form;

class Form {

    // Свойства объекта
    public $data;

    // Метод для записи данных в файл
    function saveFormData() {
        $formDataFile = fopen('../../data.json','w');
        fwrite($formDataFile, json_encode($this->data, JSON_UNESCAPED_UNICODE));
        fclose($formDataFile);
    }

}
?>