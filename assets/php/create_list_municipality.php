<?php 
    require_once 'Class/Database.php';

    $sentence = file_get_contents('sql/query_municipality.sql');
    $db = new Database();
    $query = $db -> connect() -> prepare($sentence);
    $query -> execute();

    if($query){
        $data = [array(
            'value' => '',
            'text' => '---'
        )];
        $response = true;

        while($rows = $query -> fetch(PDO::FETCH_ASSOC)){
            array_push($data, [
                'value' => $rows['value'],
                'text' => $rows['label']
            ]);
        }

    }else{
        $response = false;
        $data = null;
    }

    echo json_encode(array(
        'response' => $response,
        'data' => $data
    ), JSON_NUMERIC_CHECK);

?>