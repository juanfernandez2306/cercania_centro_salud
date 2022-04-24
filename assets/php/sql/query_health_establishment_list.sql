SELECT
ST_X(geom) AS lng,
ST_Y(geom) AS lat,
UPPER(nombre) AS name,
ST_Distance_Sphere(geom, ST_GeomFromText(%s, 4326)) AS distance
FROM establecimientos_salud
WHERE
ST_Contains(
    ST_Buffer(ST_GeomFromText(%s, 4326), %s),
    geom
) = 1
ORDER BY distance ASC
LIMIT 10;
