const express = require('express');

const app = express();

// View engine setup
app.set('views', './views');
app.set('view engine', 'hbs');

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/images'))

// index
app.get('/', async (req, res) => {
    res.render('home')
})

// All Products page
app.get('/allproducts', async (req, res) => {
    res.render('allproducts')
})


// Insert Products
app.post('/insert', async (req, res) => {
    const name = req.body.txtName
    const category = req.body.txtCategory;
    const price = req.body.txtPrice
    const url = req.body.txtURL;
    if (url.length == 0) {
        var result = await getAll("Products")
        res.render('home', { products: result, picError: 'Phai nhap Picture!' })
    } else {
        //xay dung doi tuong insert
        const obj = { name: name, price: price, picURL: url, cat: category }
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
    let updateValues = { $set: { name: name, price: price } };

    await updateDocument(id, updateValues, "Products")
    res.redirect('/')
})


// Edit Products
app.get('/edit/:id', async (req,res) => {
    const idValue = req.params.id
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