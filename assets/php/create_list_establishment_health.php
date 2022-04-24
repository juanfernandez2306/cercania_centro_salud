<?php 
    require_once 'Class/Database.php';
    require_once 'function.php';


    function get_info_community($id_comunidad){
        $sentence = file_get_contents('sql/query_geometry_community.sql');
        $db = new Database();
        $query = $db -> connect() -> prepare($sentence);
        $query -> execute(['id_comunidad' => $id_comunidad]);

        if($query){
            $response = true;
            $row = $query -> fetch(PDO::FETCH_ASSOC);
            $data = array(
                'lng' => $row['lng'],
                'lat' => $row['lat'],
                'text_geom' => $row['text_geom'],
                'name' => strtoupper($row['name'])
            );
        }else{
            $response = false;
            $data = null;
        }

        return array(
            'response' => $response,
            'data' => $data
        );

    }

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
        'id_comunidad' => isset($_POST['id_comunidad']) ? validation_input_integer($_POST['id_comunidad']) : null,
        'distance' => isset($_POST['distance']) ? validation_limit_distance($_POST['distance']) : null
    ), 'returns_data_not_null');

    $message = null;

    if(count($filter_data) == 2){
        $response = true;
        $filter_data;
        $data = array();

        $id_comunidad = $filter_data['id_comunidad'];
        
        $distance = $filter_data['distance'];

        
        $radius_earth = 6371;

        $tita = ( ($distance / 1000) / $radius_earth) * (180 / pi());

        $info_community = get_info_community($id_comunidad);

        if($info_community['response']){

            $lat = $info_community['data']['lat'];
            $lng = $info_community['data']['lng'];

            $data['community'] = array(
                'name' => $info_community['data']['name'],
                'coordinates' => array(
                    'lat' => $lat,
                    'lng' => $lng
                ),
                'distance' => $distance
            );

            $pointstring = $info_community['data']['text_geom'];
            $sentence = file_get_contents('sql/query_health_establishment_list.sql');

            $sentence = sprintf($sentence, 
            "'" . $pointstring . "'", "'" . $pointstring . "'", $tita);

            
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
            $message = 'La consulta de la comunidad no genero ninguna respuesta valida';

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