SELECT
ROUND(
    ST_X(geom),
5) AS lng,
ROUND(
    ST_Y(geom),
5) AS lat,
UPPER(nombre) AS name,
ROUND(
    ST_Distance_Sphere(
        geom, 
        ST_GeomFromText(%s, 4326)
    ), 2) AS distance
FROM establecimientos_salud
WHERE
ST_Contains(
    ST_Buffer(ST_GeomFromText(%s, 4326), %s),
    geom
) = 1
ORDER BY distance ASC
LIMIT 30;
