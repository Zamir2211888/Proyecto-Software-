const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Conexión a PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME || 'testdb', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || 'postgres', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: false,
});

// Definición modelo Item
const Item = sequelize.define('Item', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
});

// Sincronización e inicialización de datos
async function initialize() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // recrea tablas

    // Carga masiva de datos para pruebas (1000 items)
    const bulkItems = [];
    for (let i = 1; i <= 1000; i++) {
      bulkItems.push({
        name: `Item ${i}`,
        description: `Descripción para item número ${i}`,
        quantity: Math.floor(Math.random() * 100),
      });
    }
    await Item.bulkCreate(bulkItems);

    console.log('Base de datos inicializada con datos.');
  } catch (error) {
    console.error('Error en inicialización:', error);
  }
}
initialize();

// Rutas REST CRUD

// Obtener todos (paginación simple con ?page=1&limit=20)
app.get('/items', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  try {
    const { rows, count } = await Item.findAndCountAll({ limit, offset, order: [['id', 'ASC']] });
    res.json({ total: count, page, limit, data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener items' });
  }
});

// Obtener item por id
app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    res.json(item);
  } catch {
    res.status(500).json({ error: 'Error al obtener item' });
  }
});

// Crear nuevo item
app.post('/items', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch {
    res.status(400).json({ error: 'Error al crear item' });
  }
});

// Actualizar item
app.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    await item.update(req.body);
    res.json(item);
  } catch {
    res.status(400).json({ error: 'Error al actualizar item' });
  }
});

// Eliminar item
app.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    await item.destroy();
    res.status(204).end();
  } catch {
    res.status(400).json({ error: 'Error al eliminar item' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});