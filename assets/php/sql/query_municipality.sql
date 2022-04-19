SELECT 
cod_mun AS value,
UPPER(municipio) AS label
FROM municipios
WHERE cod_estado = 23
ORDER BY cod_mun ASC