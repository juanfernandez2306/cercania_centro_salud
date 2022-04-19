<?php 
    function validation_input_integer($value){
        if(is_numeric($value)){
            return (int) $value;
        }else{
            return null;
        }
    }

    function validation_limit_distance($input){

        $number = validation_input_integer($input);

        $validation = null;

        if($number != null){
            if($number >= 200 and $number <= 4000){
                $validation = $number;
            }
        }

        return $validation;
        
    }

    function remove_duplicate_text($text){
        $array_text = explode(',', $text);
        $array_text = array_unique($array_text);
        $count_items = count($array_text);
        $text = implode(', ', $array_text);

        return ['text' => $text, 'count' => $count_items];
    }

    function returns_data_not_null($data){
		if ($data != null){
			return $data;
		}
	}
    
?>