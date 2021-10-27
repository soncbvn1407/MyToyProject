const express = require('express');
const { insertToDB, getAll, deleteObject, getDocumentById, updateDocument } = require('./databaseHandler')
const app = express();
var idValue

// View engine setup
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }))

//
const path = require('path')
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))


// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/images'))

// ngay thang
function formatDate(date){
    return new Date(date).toLocaleString("vi-VN")
}

// index
app.get('/', async (req, res) => {
    var result = await getAll("Products")
    var time = new Date().toISOString()
    res.render('home', { products: result, now:formatDate(time)})
})

// Insert Products
app.post('/insert', async (req, res) => {
    const name = req.body.txtName
    name.substring(0,3)
    const category = req.body.txtCategory;
    const price = req.body.txtPrice
    const url = req.body.txtURL;
    if (name.length == 0) {
        var result = await getAll("Products")
        res.render('home', { products: result, nameError: 'Phai nhap Name!' })
    }
    else if (url.length == 0) {
        var result = await getAll("Products")
        res.render('home', { products: result, picError: 'Phai nhap Picture!' })
    }
    else if (price.length == 0) {
        var result = await getAll("Products")
        res.render('home', { products: result, nameError:null, priceError: "Vui Long Nhap Lai!" })
    }
    else {
        //xay dung doi tuong insert
        const obj = { name: name, price: price, picURL: url, cat: category}
        //goi ham de insert vao DB
        await insertToDB(obj, "Products")
        res.redirect('/')
    }
})


// Delete Products
app.get('/delete/:id', async (req, res) => {
    const idValue = req.params.id
    //viet ham xoa object dua tren id
    await deleteObject(idValue, "Products")
    res.redirect('/')
})


// Update Products
app.post('/update', async (req, res) => {
    const id = req.body.txtId
    const name = req.body.txtName
    const price = req.body.txtPrice
    const url = req.body.txtURL
    let updateValues = { $set: { name: name, price: price, picURL: url } };
    // if (url.endsWith('png')==false) {
    //     const productToEdit = await getDocumentById(idValue, "Products")
    //     res.render('edit', {picError: 'Ảnh trống hoặc ảnh không hợp lệ!', product: productToEdit })
    // } 
     if (url.length == 0 || url.endsWith('jpg')) {
        // var result = await getAll("Products")
        const productToEdit = await getDocumentById(idValue, "Products")
        res.render('edit', {picError: 'Ảnh trống hoặc ảnh không hợp lệ!', product: productToEdit })
    } else {
    await updateDocument(id, updateValues, "Products")
    res.redirect('/')}
})


// Edit Products
app.get('/edit/:id', async (req,res) => {
     idValue = req.params.id
     //lay thong tin cu cua sp cho nguoi dung xem, sua
     const productToEdit = await getDocumentById(idValue, "Products")
     //hien thi ra de sua
     res.render("edit", { product: productToEdit })
 })


// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server started on port 3000');
})