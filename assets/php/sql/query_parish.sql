SELECT
cod_parr AS value,
UPPER(parroquia) AS label
FROM parroquias
WHERE cod_mun = :cod_mun
ORDER BY cod_parr ASC
