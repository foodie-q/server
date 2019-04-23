const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')

const { createOrder } = require('../helpers/firebase/orders')
const { dbMenus } = require('../helpers/firebase/index')

const {getMenusList, findById, createMenu} = require('../helpers/firebase/menus')

chai.use(chaiHttp)




// create User
let menuid
describe(`testing endpoint menus`, function () {
    //clear data

    after(function (done) {
        dbMenus.doc(menuid).delete()
            .then(() => {
                done()
            })
    })
    let newMenu
    describe(`POST /menus/ for create new menu`, function () {
        describe(`POST /menus/ success case`, function () {
            it(`should send response with status code 201, and is an object when create menu`, function (done) {
                this.timeout(10000)
                newMenu = {
                    image: 'https://foreres.files.wordpress.com/2010/04/small-american-flag.jpg',
                    name: 'Mie bang Testing',
                    max : 10,
                    price: 12500,
                    time : 200
                }

                chai
                    .request(app)
                    .post('/menus')
                    .send(newMenu)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(201)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('id')
                        
                        menuid = res.body.id
                        done()
                    })
            })

        })

    })

    describe(`GET /menus/ for getting all menu`, function () {
        describe(`GET /menus/ success case`, function () {
            it(`should send response with status code 200, and is an array`, function (done) {
                this.timeout(6000)

                chai
                    .request(app)
                    .get('/menus/')
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('array')
                        expect(res.body[0]).to.have.property('image')
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0]).to.have.property('max')
                        expect(res.body[0]).to.have.property('price')
                        expect(res.body[0]).to.have.property('name')
                        expect(res.body[0]).to.have.property('time')

                        done()
                    })
            })

        })
    })

    describe(`GET /menus/:id for find specific menu`, function () {
        describe(`GET /menus/:id success case`, function () {
            it(`should send response with status code 200, and send an object`, function (done) {
                this.timeout(6000)
                
                chai
                    .request(app)
                    .get(`/menus/${menuid}`)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('image')
                        expect(res.body).to.have.property('max')
                        expect(res.body).to.have.property('price')
                        expect(res.body).to.have.property('name')
                        expect(res.body).to.have.property('time')
                        expect(res.body.image).to.be.equal(newMenu.image)

                        done()
                    })
            })
            
        })

    })

})