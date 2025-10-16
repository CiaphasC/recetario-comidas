INSERT INTO Categorias (nombre, descripcion) VALUES
  ('Criolla', 'Platos tradicionales de la cocina peruana'),
  ('Marina', 'Recetas frescas con pescados y mariscos'),
  ('Guisos', 'Preparaciones de coccion lenta y hogarenas'),
  ('Fusion', 'Sabores con influencia nikkei y chifa'),
  ('Entradas', 'Opciones frias y calientes para comenzar'),
  ('Postres', 'Dulces clasicos para compartir');

INSERT INTO Ingredientes (nombre, unidad_medida) VALUES
  ('Lomo de res', 'kg'),
  ('Filete de pescado fresco', 'kg'),
  ('Pechuga de pollo', 'kg'),
  ('Papa amarilla', 'kg'),
  ('Cebolla roja', 'kg'),
  ('Tomate', 'kg'),
  ('Aji amarillo', 'unidades'),
  ('Aji limo', 'unidades'),
  ('Aji panca pasta', 'g'),
  ('Culantro', 'ramas'),
  ('Limon', 'unidades'),
  ('Camote', 'unidades'),
  ('Choclo desgranado', 'tazas'),
  ('Sillao', 'ml'),
  ('Vinagre tinto', 'ml'),
  ('Arroz cocido', 'g'),
  ('Pan de molde', 'rebanadas'),
  ('Leche evaporada', 'ml'),
  ('Queso parmesano', 'g'),
  ('Mayonesa', 'g'),
  ('Atun en lata', 'latas'),
  ('Palta', 'unidades'),
  ('Aceite vegetal', 'ml'),
  ('Aceite de ajonjoli', 'ml'),
  ('Kion fresco', 'g'),
  ('Cebolla china', 'tallos'),
  ('Corazon de res', 'kg'),
  ('Comino molido', 'g'),
  ('Ajo', 'dientes'),
  ('Sal', 'g'),
  ('Pimienta negra', 'g'),
  ('Huevos', 'unidades'),
  ('Leche condensada', 'ml'),
  ('Azucar', 'g'),
  ('Vainilla', 'ml'),
  ('Canela molida', 'g');

INSERT INTO Recetas (nombre, descripcion, id_categoria) VALUES
  (
    'Ceviche Clasico',
    'Pescado fresco marinado en jugo de limon con ajies peruanos.',
    (SELECT id_categoria FROM Categorias WHERE nombre = 'Marina')
  ),
  (
    'Lomo Saltado',
    'Salteado criollo de lomo de res con verduras y papas fritas.',
    (SELECT id_categoria FROM Categorias WHERE nombre = 'Criolla')
  ),
  (
    'Aji de Gallina',
    'Guiso cremoso de pollo deshilachado con aji amarillo.',
    (SELECT id_categoria FROM Categorias WHERE nombre = 'Guisos')
  ),
  (
    'Causa Limena',
    'Pure de papa amarilla relleno con atun y palta.',
    (SELECT id_categoria FROM Categorias WHERE nombre = 'Entradas')
  ),
  (
    'Arroz Chaufa',
    'Version peruana del arroz frito con pollo y ajies.',
    (SELECT id_categoria FROM Categorias WHERE nombre = 'Fusion')
  ),
  (
    'Anticuchos de Corazon',
    'Brochetas marinadas de corazon de res a la parrilla.',
    (SELECT id_categoria FROM Categorias WHERE nombre = 'Criolla')
  ),
  (
    'Suspiro a la Limena',
    'Postre tradicional de manjar blanco con merengue.',
    (SELECT id_categoria FROM Categorias WHERE nombre = 'Postres')
  );

INSERT INTO Ingredientes_Recetas (id_receta, id_ingrediente, cantidad) VALUES
  -- Ceviche Clasico
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Ceviche Clasico'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Filete de pescado fresco'),
    0.8
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Ceviche Clasico'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Limon'),
    12
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Ceviche Clasico'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Cebolla roja'),
    0.4
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Ceviche Clasico'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aji limo'),
    2
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Ceviche Clasico'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Culantro'),
    6
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Ceviche Clasico'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Sal'),
    8
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Ceviche Clasico'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Camote'),
    2
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Ceviche Clasico'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Choclo desgranado'),
    1
  ),
  -- Lomo Saltado
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Lomo de res'),
    0.6
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Cebolla roja'),
    0.3
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Tomate'),
    0.4
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aji amarillo'),
    2
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Ajo'),
    3
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Sillao'),
    60
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Vinagre tinto'),
    30
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Papa amarilla'),
    0.8
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aceite vegetal'),
    40
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Sal'),
    5
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Lomo Saltado'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pimienta negra'),
    3
  ),
  -- Aji de Gallina
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pechuga de pollo'),
    0.7
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aji amarillo'),
    3
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pan de molde'),
    4
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Leche evaporada'),
    400
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Queso parmesano'),
    80
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Papa amarilla'),
    0.6
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Huevos'),
    2
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Ajo'),
    3
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Cebolla roja'),
    0.2
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aceite vegetal'),
    30
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Sal'),
    5
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Aji de Gallina'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pimienta negra'),
    2
  ),
  -- Causa Limena
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Causa Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Papa amarilla'),
    0.8
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Causa Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aji amarillo'),
    2
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Causa Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Limon'),
    6
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Causa Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aceite vegetal'),
    20
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Causa Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Mayonesa'),
    120
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Causa Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Atun en lata'),
    2
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Causa Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Palta'),
    2
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Causa Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Huevos'),
    2
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Causa Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Sal'),
    4
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Causa Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pimienta negra'),
    2
  ),
  -- Arroz Chaufa
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Arroz cocido'),
    600
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pechuga de pollo'),
    0.4
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Huevos'),
    3
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Cebolla china'),
    4
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Sillao'),
    80
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aceite de ajonjoli'),
    15
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Kion fresco'),
    15
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aji amarillo'),
    1
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aceite vegetal'),
    25
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Sal'),
    3
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Arroz Chaufa'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pimienta negra'),
    2
  ),
  -- Anticuchos de Corazon
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Anticuchos de Corazon'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Corazon de res'),
    1
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Anticuchos de Corazon'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aji panca pasta'),
    100
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Anticuchos de Corazon'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Ajo'),
    4
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Anticuchos de Corazon'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Comino molido'),
    4
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Anticuchos de Corazon'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Vinagre tinto'),
    50
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Anticuchos de Corazon'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aceite vegetal'),
    40
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Anticuchos de Corazon'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Papa amarilla'),
    0.6
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Anticuchos de Corazon'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Choclo desgranado'),
    2
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Anticuchos de Corazon'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Sal'),
    6
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Anticuchos de Corazon'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pimienta negra'),
    3
  ),
  -- Suspiro a la Limena
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Suspiro a la Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Leche evaporada'),
    400
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Suspiro a la Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Leche condensada'),
    395
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Suspiro a la Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Azucar'),
    200
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Suspiro a la Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Huevos'),
    4
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Suspiro a la Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Vainilla'),
    5
  ),
  (
    (SELECT id_receta FROM Recetas WHERE nombre = 'Suspiro a la Limena'),
    (SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Canela molida'),
    2
  );

INSERT INTO Compras (id_ingrediente, fecha_compra, cantidad) VALUES
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Lomo de res'), '2025-01-05', 1.2),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Filete de pescado fresco'), '2025-01-04', 1.5),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pechuga de pollo'), '2025-01-03', 2),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Papa amarilla'), '2025-01-02', 5),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Cebolla roja'), '2025-01-06', 4),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Tomate'), '2025-01-06', 1.5),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aji amarillo'), '2025-01-07', 24),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aji limo'), '2025-01-07', 12),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aji panca pasta'), '2025-01-09', 500),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Culantro'), '2025-01-08', 30),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Limon'), '2025-01-01', 60),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Camote'), '2025-01-05', 10),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Choclo desgranado'), '2025-01-05', 8),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Sillao'), '2025-01-10', 1000),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Vinagre tinto'), '2025-01-10', 500),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Arroz cocido'), '2025-01-04', 2000),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pan de molde'), '2025-01-03', 30),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Leche evaporada'), '2025-01-02', 1200),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Queso parmesano'), '2025-01-02', 500),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Mayonesa'), '2025-01-09', 300),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Atun en lata'), '2025-01-09', 10),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Palta'), '2025-01-05', 12),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aceite vegetal'), '2025-01-01', 1500),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Aceite de ajonjoli'), '2025-01-01', 200),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Kion fresco'), '2025-01-05', 200),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Cebolla china'), '2025-01-06', 15),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Corazon de res'), '2025-01-04', 1.5),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Comino molido'), '2025-01-07', 100),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Ajo'), '2025-01-02', 50),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Sal'), '2025-01-01', 1000),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Pimienta negra'), '2025-01-01', 200),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Huevos'), '2025-01-03', 60),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Leche condensada'), '2025-01-02', 800),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Azucar'), '2025-01-02', 2000),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Vainilla'), '2025-01-08', 50),
  ((SELECT id_ingrediente FROM Ingredientes WHERE nombre = 'Canela molida'), '2025-01-08', 40);
