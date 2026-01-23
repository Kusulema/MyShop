// Контроллер для web-части работы с товарами (страницы)

const { getModels } = require('../models');

// Главная страница - список товаров
async function listPage(req, res) {
  const { Product } = getModels();
  const products = await Product.findAll({ order: [['id', 'ASC']] });
  res.render('index', { title: 'IncMonster', products });
}

// Форма создания товара (только админ)
async function newForm(req, res) {
  res.render('product_form', { title: 'New Product', product: null });
}

// Создание товара
async function create(req, res) {
  const { Product } = getModels();
  const { name, desc, price, style } = req.body; // ДОБАВЛЕНО 'style'
  let { pic } = req.body;
  if (!pic || !pic.trim()) pic = '/img/pic.png';
  await Product.create({ name, desc, price, pic, style }); // ДОБАВЛЕНО 'style'
  res.redirect('/');
}

// Форма редактирования
async function editForm(req, res) {
  const { Product } = getModels();
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).send('Not Found');
  res.render('product_form', { title: 'Edit Product', product });
}

// Обновление товара
async function update(req, res) {
  const { Product } = getModels();
  const { name, desc, price, style } = req.body; // ДОБАВЛЕНО 'style'
  let { pic } = req.body;
  if (!pic || !pic.trim()) pic = '/img/pic.png';
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).send('Not Found');
  await product.update({ name, desc, price, pic, style }); // ДОБАВЛЕНО 'style'
  res.redirect('/');
}

// Удаление товара
async function remove(req, res) {
  const { Product } = getModels();
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).send('Not Found');
  await product.destroy();
  res.redirect('/');
}

module.exports = { listPage, newForm, create, editForm, update, remove };