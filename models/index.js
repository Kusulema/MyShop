const User = require('./User');
const Product = require('./Product');
const bcrypt = require('bcryptjs'); 

let sequelize = null;
let models = null; 

/**
 * Инициализирует подключение к БД, определяет модели и синхронизирует их.
 */
async function initDb() {
  try {
    const createSequelize = require('../config/database');
    // 1. Создаем инстанс Sequelize и базу данных (если не существует)
    sequelize = await createSequelize();

    // 2. Определяем модели, передавая им инстанс Sequelize
    const UserDefined = User(sequelize);
    const ProductDefined = Product(sequelize);
    
    // ... (отношения) ...

    // 3. Синхронизируем модели с базой данных
    await sequelize.sync({ alter: true });

    // 4. Добавление начальных данных
    // --------------------------------------------------------------------------------
    // ⬇️ ЗАМЕНИТЕ ВЕСЬ СТАРЫЙ БЛОК НА ЭТОТ ⬇️
    // --------------------------------------------------------------------------------
    const productsCount = await ProductDefined.count(); // Используем ProductDefined
    if (productsCount === 0) {
      const initialItems = [
        {
          name: 'Эскиз "Спящий Дракон"',
          desc: 'Детализированный эскиз дракона в черном цвете. Идеально подходит для плеча или предплечья. Сложность: средняя.',
          style: 'Блэкворк/Реализм',
          price: 150.00,
          pic: '/img/sketches/dragon.png'
        },
        {
          name: 'Набор "Миниатюры"',
          desc: 'Коллекция из 5 минималистичных эскизов маленького размера. Отлично подходят для первых тату или скрытых мест.',
          style: 'Минимализм',
          price: 80.00,
          pic: '/img/sketches/minis.png'
        },
        {
          name: 'Нео-Традиционная Роза',
          desc: 'Яркий и смелый дизайн розы с толстыми контурами и насыщенными цветами. Классика в новом исполнении.',
          style: 'Нео-Традиционный',
          price: 220.50,
          pic: '/img/sketches/neorose.png'
        },
        {
          name: 'Абстрактная Геометрия',
          desc: 'Уникальный дизайн, состоящий из тонких линий и геометрических фигур. Подчеркнет вашу индивидуальность.',
          style: 'Геометрия/Лайнворк',
          price: 125.99,
          pic: '/img/sketches/geo_abs.png'
        },
        {
          name: 'Мандала "Гармония"',
          desc: 'Сложный и симметричный узор мандалы, выполненный точками и тонкими линиями. Требует точной проработки.',
          style: 'Дотворк',
          price: 190.00,
          pic: '/img/sketches/mandala.png'
        }
      ];

      await ProductDefined.bulkCreate(initialItems); // Используем ProductDefined
      console.log(`[DB] Created ${initialItems.length} initial tattoo sketches.`);
    }
    // --------------------------------------------------------------------------------
    // ⬆️ КОНЕЦ НОВОГО БЛОКА ⬆️
    // --------------------------------------------------------------------------------
    
    // 5. Сохраняем инициализированные модели в переменную models
    models = { User: UserDefined, Product: ProductDefined };
    
    console.log('[DB] Database models initialized and synchronized.');

  } catch (error) {
    console.error('[DB] Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Возвращает инициализированные модели (User, Product).
 */
function getModels() {
  return models;
}

module.exports = { initDb, getModels };