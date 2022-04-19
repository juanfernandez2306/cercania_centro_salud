SELECT
X(geom) AS lng,
Y(geom) AS lat,
UPPER(nombre) AS name,
ROUND(
    RADIANS(
        SQRT(
            POWER(
                ABS(X(geom) - X(
                    GeomFromText(%s)
                    )), 2
            )
            +
            POWER(
                ABS(Y(geom) - Y(
                    GeomFromText(%s)
                )), 2
            )
        )
    ) * 6371 * 1000
, 2) AS distance
FROM establecimientos_salud
WHERE
MBRContains(
    Envelope(GeomFromText(%s)),
    geom
) = 1
ORDER BY distance ASC
LIMIT 10;
