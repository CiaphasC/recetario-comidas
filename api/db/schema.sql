PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Ingredientes (
  id_ingrediente INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  unidad_medida TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS IngredientesStock (
  id_ingrediente INTEGER PRIMARY KEY,
  stock_total REAL NOT NULL DEFAULT 0 CHECK (stock_total >= 0),
  ultima_actualizacion TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_ingrediente) REFERENCES Ingredientes(id_ingrediente) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS Categorias (
  id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS Recetas (
  id_receta INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT NULL,
  id_categoria INTEGER NULL,
  FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria) ON DELETE SET NULL
) STRICT;

CREATE TABLE IF NOT EXISTS Ingredientes_Recetas (
  id_ingrediente INTEGER NOT NULL,
  id_receta INTEGER NOT NULL,
  cantidad REAL NOT NULL CHECK (cantidad > 0),
  PRIMARY KEY (id_ingrediente, id_receta),
  FOREIGN KEY (id_ingrediente) REFERENCES Ingredientes(id_ingrediente) ON DELETE CASCADE,
  FOREIGN KEY (id_receta) REFERENCES Recetas(id_receta) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS Compras (
  id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
  id_ingrediente INTEGER NOT NULL,
  fecha_compra TEXT NOT NULL,
  cantidad REAL NOT NULL CHECK (cantidad > 0),
  FOREIGN KEY (id_ingrediente) REFERENCES Ingredientes(id_ingrediente) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_recetas_categoria ON Recetas(id_categoria);
CREATE INDEX IF NOT EXISTS idx_compras_ingrediente ON Compras(id_ingrediente);
CREATE INDEX IF NOT EXISTS idx_compras_fecha ON Compras(fecha_compra);
CREATE UNIQUE INDEX IF NOT EXISTS idx_recetas_nombre ON Recetas(nombre);

CREATE TRIGGER IF NOT EXISTS trg_ingredientes_insert_stock
AFTER INSERT ON Ingredientes
BEGIN
  INSERT INTO IngredientesStock (id_ingrediente, stock_total, ultima_actualizacion)
  VALUES (NEW.id_ingrediente, 0, CURRENT_TIMESTAMP)
  ON CONFLICT(id_ingrediente) DO NOTHING;
END;

CREATE TRIGGER IF NOT EXISTS trg_ingredientes_delete_stock
AFTER DELETE ON Ingredientes
BEGIN
  DELETE FROM IngredientesStock WHERE id_ingrediente = OLD.id_ingrediente;
END;

CREATE TRIGGER IF NOT EXISTS trg_compras_insert_stock
AFTER INSERT ON Compras
BEGIN
  INSERT INTO IngredientesStock (id_ingrediente, stock_total, ultima_actualizacion)
  VALUES (NEW.id_ingrediente, NEW.cantidad, CURRENT_TIMESTAMP)
  ON CONFLICT(id_ingrediente) DO UPDATE SET
    stock_total = stock_total + NEW.cantidad,
    ultima_actualizacion = CURRENT_TIMESTAMP;
END;

CREATE TRIGGER IF NOT EXISTS trg_compras_update_stock
AFTER UPDATE ON Compras
BEGIN
  UPDATE IngredientesStock
  SET stock_total = stock_total - OLD.cantidad,
      ultima_actualizacion = CURRENT_TIMESTAMP
  WHERE id_ingrediente = OLD.id_ingrediente;

  SELECT
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM IngredientesStock
        WHERE id_ingrediente = OLD.id_ingrediente
          AND stock_total < 0
      )
      THEN RAISE(ABORT, 'El stock no puede ser negativo')
    END;

  INSERT INTO IngredientesStock (id_ingrediente, stock_total, ultima_actualizacion)
  VALUES (NEW.id_ingrediente, NEW.cantidad, CURRENT_TIMESTAMP)
  ON CONFLICT(id_ingrediente) DO UPDATE SET
    stock_total = stock_total + NEW.cantidad,
    ultima_actualizacion = CURRENT_TIMESTAMP;

  SELECT
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM IngredientesStock
        WHERE id_ingrediente = NEW.id_ingrediente
          AND stock_total < 0
      )
      THEN RAISE(ABORT, 'El stock no puede ser negativo')
    END;
END;

CREATE TRIGGER IF NOT EXISTS trg_compras_delete_stock
AFTER DELETE ON Compras
BEGIN
  UPDATE IngredientesStock
  SET stock_total = stock_total - OLD.cantidad,
      ultima_actualizacion = CURRENT_TIMESTAMP
  WHERE id_ingrediente = OLD.id_ingrediente;

  SELECT
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM IngredientesStock
        WHERE id_ingrediente = OLD.id_ingrediente
          AND stock_total < 0
      )
      THEN RAISE(ABORT, 'El stock no puede ser negativo')
    END;
END;
