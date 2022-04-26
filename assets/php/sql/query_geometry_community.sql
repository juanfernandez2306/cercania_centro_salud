SELECT
ST_AsText(com.geom) AS text_geom,
ROUND(
	ST_X(com.geom), 
5) AS lng,
ROUND(
	ST_Y(com.geom),
5) AS lat,
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
END AS name
FROM comunidades AS com
LEFT JOIN categorias_comunidades AS cat ON cat.id_categoria = com.id_categoria
WHERE com.id_comunidad = :id_comunidad