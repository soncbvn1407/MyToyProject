const express = require('express')
const { insertToDB, getAll, deleteObject, getDocumentById, updateDocument } = require('./databaseHandler')
const app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

const path = require('path')
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))


app.post('/update', async (req, res) => {
    const id = req.body.txtId
    const name = req.body.txtName
    const price = req.body.txtPrice
    let updateValues = { $set: { name: name, price: price } };

    await updateDocument(id, updateValues, "Products")
    res.redirect('/')
})

app.get('/edit/:id', async (req, res) => {
    const idValue = req.params.id
    //lay thong tin cu cua sp cho nguoi dung xem, sua
    const productToEdit = await getDocumentById(idValue, "Products")
    //hien thi ra de sua
    res.render("edit", { product: productToEdit })
})

app.get('/', async (req, res) => {
    var result = await getAll("Products")
    res.render('home', { products: result })
})
app.get('/delete/:id', async (req, res) => {
    const idValue = req.params.id
    //viet ham xoa object dua tren id
    await deleteObject(idValue, "Products")
    res.redirect('/')
})
app.post('/insert', async (req, res) => {
    const name = req.body.txtName
    const price = req.body.txtPrice
    const url = req.body.txtURL;
    if (url.length == 0) {
        var result = await getAll("Products")
        res.render('home', { products: result, picError: 'Phai nhap Picture!' })
    } else {
        //xay dung doi tuong insert
        const obj = { name: name, price: price, picURL: url }
        //goi ham de insert vao DB
        await insertToDB(obj, "Products")
        res.redirect('/')
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')