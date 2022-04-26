<?php 
    require_once 'Class/Database.php';
    require_once 'function.php';

    function create_list_establishment($sentence){
        $db = new Database();
        $query = $db -> connect() -> prepare($sentence);
        $query -> execute();

        $result_establishment = array();

        while($rows = $query -> fetch(PDO::FETCH_ASSOC)){
            array_push($result_establishment, 
                array(
                    'coordinates' => array(
                        'lat' => $rows['lat'],
                        'lng' => $rows['lng']
                    ),
                    'name' => $rows['name'],
                    'distance' => $rows['distance']
                )
            );
        }

        return $result_establishment;
    }

    $filter_data = array_filter(array(
        'lat' => isset($_POST['lat']) ? validation_input_float($_POST['lat']) : null,
        'lng' => isset($_POST['lng']) ? validation_input_float($_POST['lng']) : null
    ), 'returns_data_not_null');

    $message = null;

    if(count($filter_data) == 2){
        $response = true;
        $data = array();

        /**
         * average radius earth in km
         */
        $radius_earth = 6371;

        $tita = ( (2000 / 1000) / $radius_earth) * (180 / pi());

        $lat = round($filter_data['lat'], 5);
        $lng = round($filter_data['lng'], 5);

        $data['community'] = array(
            'name' => 'MI UBICACION',
            'coordinates' => array(
                'lat' => $lat,
                'lng' => $lng
            ),
            'distance' => 2000
        );

        $pointstring = sprintf('POINT(%s %s)', $lng, $lat);

        $sentence = file_get_contents('sql/query_health_establishment_list.sql');

        $sentence = sprintf($sentence, 
            "'" . $pointstring . "'", 
            "'" . $pointstring . "'", 
            $tita
        );

        $result_establishment = create_list_establishment($sentence);

        if(count($result_establishment) > 0){

            $data['establishment'] = $result_establishment;
            
        }else{
            $response = false;
            $data = null;
            $message = 'La consulta no genero ningún registro disponible';
        }

    }else{
        $response = false;
        $data = null;
        $message = 'Parámetros inválidos ó nulos';
    }

    echo json_encode([
        'response' => $response,
        'data' => $data,
        'message' => $message
    ], JSON_NUMERIC_CHECK);
?>