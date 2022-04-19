<?php 
    require_once 'Class/Database.php';
    require_once 'function.php';

    $cod_mun = isset($_POST['cod_mun']) ? validation_input_integer($_POST['cod_mun']) : null;

    if($cod_mun != null){
        $sentence = file_get_contents('sql/query_parish.sql');
        $db = new Database();
        $query = $db -> connect() -> prepare($sentence);
        $query -> execute(['cod_mun' => $cod_mun]);

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