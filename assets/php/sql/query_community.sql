SELECT
com.id_comunidad AS value,
CASE 
    WHEN com.sector IS NULL THEN
        CASE 
        WHEN com.id_categoria < 6 OR com.id_categoria IS NULL 
            THEN com.nombre
        ELSE CONCAT(cat.tipo, ' ', com.nombre)
        END
    ELSE
        CASE
        WHEN com.id_categoria < 6 OR com.id_categoria IS NULL 
            THEN CONCAT(com.nombre, ' ST ', com.sector)
        WHEN com.id_categoria = 7 
            THEN CONCAT(cat.tipo, ' ', com.nombre, ' ', com.sector)
        ELSE CONCAT(cat.tipo, ' ', com.nombre, ' ST ', com.sector)
        END
END AS label
FROM comunidades AS com
LEFT JOIN categorias_comunidades AS cat ON cat.id_categoria = com.id_categoria
WHERE com.cod_parr = :cod_parr