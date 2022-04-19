<?php 
    require_once 'Class/Database.php';
    require_once 'function.php';

    $filter_data = array_filter(array(
        'id_comunidad' => isset($_POST['id_comunidad']) ? validation_input_integer($_POST['id_comunidad']) : null,
        'distance' => isset($_POST['distance']) ? validation_limit_distance($_POST['distance']) : null
    ), 'returns_data_not_null');

    if(count($filter_data) == 2){
        $response = true;
        $data = $filter_data;

        $id_comunidad = $data['id_comunidad'];
        /**
         * distance submit in km
         */
        $distance = $data['distance'] / 1000;

        /**
         * average radius earth in km
         */
        $radius_earth = 6371;

        $tita = ($distance / $radius_earth) * (180 / pi());

        $data['tita'] = $tita;

    }else{
        $response = false;
        $data = null;
    }

    echo json_encode([
        'response' => $response,
        'data' => $data
    ], JSON_NUMERIC_CHECK);
?>