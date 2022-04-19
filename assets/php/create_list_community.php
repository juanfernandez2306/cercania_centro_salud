<?php 
    require_once 'Class/Database.php';
    require_once 'function.php';

    $cod_parr = isset($_POST['cod_parr']) ? validation_input_integer($_POST['cod_parr']) : null;

    if($cod_parr != null){
        $sentence = file_get_contents('sql/query_community.sql');
        $db = new Database();
        $query = $db -> connect() -> prepare($sentence);
        $query -> execute(['cod_parr' => $cod_parr]);

        $data = [array(
            'value' => '',
            'text' => '---'
        )];
        $response = true;

        while($rows = $query -> fetch(PDO::FETCH_ASSOC)){
            array_push($data, [
                'value' => $rows['value'],
                'text' => strtoupper($rows['label'])
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