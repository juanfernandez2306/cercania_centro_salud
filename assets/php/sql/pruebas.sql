SELECT 
s.geom
FROM establecimientos_salud AS s
WHERE 
ST_Contains(
	s.geom,
	ST_Buffer(
		(SELECT c.geom FROM comunidades AS c WHERE c.id_comunidad = 2182),
		0.0014
	)
) = 1



--
SET @point_community = (SELECT c.geom FROM comunidades AS c WHERE c.id_comunidad = 2182);
SELECT 
UPPER(s.nombre) AS nombre,
ST_X(s.geom) AS x,
ST_Y(s.geom) AS y,
ROUND(
	ST_Distance_Sphere(s.geom, @point_community), 2
) AS distance
FROM establecimientos_salud AS s
WHERE 
ST_Contains(
	ST_Buffer(
		@point_community,
		0.0034
	),
	s.geom
) = 1
ORDER BY distance ASC
LIMIT 10


SELECT  ST_AsText(geom) FROM comunidades WHERE id_comunidad = 2182

POINT(-71.666626 10.775132)

POINT(-71.66989 10.7745)

SELECT ST_Distance_Sphere(
	ST_GeomFromText('POINT(-71.666626 10.775132)', 4326),
	ST_GeomFromText('POINT(-71.66989 10.7745)', 4326)
)

SELECT
nombre,
ST_Distance(geom, ST_GeomFromText('POINT(-71.666626 10.775132)', 4326)) AS distance,
ST_Contains(
	ST_Buffer(
		ST_GeomFromText('POINT(-71.666626 10.775132)'),
		0.0034
	),
	geom
) AS geom_contains
FROM establecimientos_salud
WHERE cod_parr = 231206

(g1, g2)

SELECT 
ST_Contains(
	ST_Buffer(
		ST_GeomFromText('POINT(-71.666626 10.775132)', 4326),
		0.004
	),
	ST_GeomFromText('POINT(-71.66989 10.7745)', 4326)
)

SELECT
ST_Buffer(
	ST_GeomFromText('POINT(-71.666626 10.775132)', 4326),
	0.0034
)


