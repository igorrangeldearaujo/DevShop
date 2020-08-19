const express = require('express')
const app = express()
const port = process.env.PORT || 2020
const category = require('./models/category')
const product = require('./models/product')

//----------connection from db-------------------
const db = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '123456789',
        database: 'devshop'
    }
})

db.on('query', query => {
    console.log('SQL: ',query.sql)
})

//----------------Seting ejs
app.set('view engine','ejs')
app.use(express.static('public'))

//-------------Functions
app.get('/', async(req, res) => {
    const categories = await category.getCategories(db)()//Call arrow function
    res.render('home', { //renderizar home page and send send data
        categories
    }) 
})

app.get('/categoria/:id/:slug',async(req, res) => {//category ou categoria
    const categories = await category.getCategories(db)()//Call arrow function
    const products = await product.getProductsByCategoryId(db)(req.params.id)
    const cat = await category.getCategoryById(db)(req.params.id)
    res.render('category', {
        products,
        categories,
        category: cat
    })
})

app.listen(port, err => {
    if(err){
        console.log(`servidor não funciona. :( na porta ${port}`)
    }else{
        console.log(`opa, funcionou blz. :) na porta ${port}`)
    }
})