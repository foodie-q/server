const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')


const { dbUsers, auth, dbSaldo,dbOrders } = require('../helpers/firebase/index')


chai.use(chaiHttp)

var admin = require('firebase-admin');
var serviceAccount = require('../final-project-anton-zul-felix-firebase-adminsdk-tn10l-3618656653.json')
var defApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://final-project-anton-zul-felix.firebaseio.com"
})


// create User
let uid
describe(`testing endpoint user`, function () {
    //clear data

    after(function (done) {
        Promise.all([
            defApp.auth().deleteUser(uid),
            dbUsers.doc(uid).delete(),
            dbSaldo.where("userId", "==", dbUsers.doc(uid)).get(),

        ])
            .then(async ([prom1, prom2, prom3]) => {
                await prom3.docs.forEach(async (item) => {
                    await dbSaldo.doc(item.id).delete()
                })

                done()
            })
            .catch((err) => {
                console.log(err.message)
            })
    })

    after(function (done) {

        dbOrders.where("userId", "==", uid).get()
            .then(order => {
                order.docs.forEach(async (item) => {
                    await dbOrders.doc(item.id).delete()
                })
                done()
            })
            .catch((err) => {
                console.log(err.message)
            })
    })
    let userEmail
    let userPass

    describe(`POST /users/register for create new user`, function () {
        describe(`POST /users/register success case`, function () {
            it(`should send response with status code 201, and is an object when create regular user`, function (done) {
                this.timeout(10000)
                let regularUser = {
                    email: `antone@mail.com`,
                    password: `123456`,
                    name: `Antone Wibisono`,
                    role: `0`
                }
                userEmail = regularUser.email
                userPass = regularUser.password

                chai
                    .request(app)
                    .post('/users/register')
                    .send(regularUser)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(201)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('name')
                        expect(res.body).to.have.property('role')
                        expect(res.body).to.have.property('arrival')
                        expect(res.body).to.have.property('table')
                        expect(res.body).to.have.property('uid')
                        expect(res.body.name).to.equal(regularUser.name)
                        expect(res.body.role).to.equal(Number(regularUser.role))
                        expect(res.body.table).to.equal(0)
                        uid = res.body.uid
                        done()
                    })
            })

        })

        describe(`POST /users/register failed case`, function () {
            it(`should send response with status code 500 and send message 'Password should be at least 6 characters' when user input wrong password`, function (done) {
                this.timeout(6000)

                // var mockDbMenu = {
                //     get() {
                //         return Promise.reject('Testing Error')
                //     }
                // }

                let newUser = {
                    email: `dodo@mail.com`,
                    password: `12345`,
                    fullName: 'Dodo',
                    role: 'user'
                }
                chai
                    .request(app)
                    .post('/users/register')
                    .send(newUser)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(500)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal(`Password should be at least 6 characters`)
                        done()
                    })
            })


        })

    })

    describe(`POST /users/login for user login`, function () {
        describe(`POST /users/login success case`, function () {
            it(`should send response with status code 200, and is an object when regular user login`, function (done) {
                this.timeout(6000)
                let loginData = {
                    email: userEmail,
                    password: userPass,
                }

                chai
                    .request(app)
                    .post('/users/login')
                    .send(loginData)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('name')
                        expect(res.body).to.have.property('role')
                        expect(res.body).to.have.property('table')
                        expect(res.body).to.have.property('uid')
                        expect(res.body).to.have.property('arrival')

                        done()
                    })
            })

        })
        describe(`POST /users/login failed case`, function () {
            it(`should send response with status code 500 and message 'The password is invalid or the user does not have a password.', when password is incorrect`, function (done) {
                this.timeout(6000)
                let loginData = {
                    email: userEmail,
                    password: 'acak'
                }

                chai
                    .request(app)
                    .post('/users/login')
                    .send(loginData)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(500)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('The password is invalid or the user does not have a password.')
                        done()
                    })
            })

            it(`should send response with status code 500 and message 'There is no user record corresponding to this identifier. The user may have been deleted.', when email is incorrect`, function (done) {
                this.timeout(6000)
                let loginData = {
                    email: "wewe@mail.com",
                    password: userPass
                }

                chai
                    .request(app)
                    .post('/users/login')
                    .send(loginData)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(500)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('There is no user record corresponding to this identifier. The user may have been deleted.')
                        done()
                    })
            })
        })
    })

    describe(`POST /users/saldo for create saldo`, function () {
        describe(`POST /users/saldo success case`, function () {
            it(`should send response with status code 200, and send an object when status is 1`, function (done) {
                this.timeout(6000)
                let payload = {
                    userId: uid,
                    createdAt: new Date(),
                    money: 111111,
                    status: 1
                }

                chai
                    .request(app)
                    .post(`/users/saldo`)
                    .send({ payload: payload })
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('string')
                        expect(res.body).to.equal('Rp111.111')

                        done()
                    })
            })
            it(`should send response with status code 200, and send an object when status is 0`, function (done) {
                this.timeout(6000)
                let payload = {
                    userId: uid,
                    createdAt: new Date(),
                    money: 11111,
                    status: 0
                }

                chai
                    .request(app)
                    .post(`/users/saldo`)
                    .send({ payload: payload })
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('string')
                        expect(res.body).to.equal('Rp100.000')

                        done()
                    })
            })

        })

        describe(`POST /users/saldo fail case`, function () {
            it(`should send response with status code 500, and send an object when no userId`, function (done) {
                this.timeout(6000)
                let payload = {
                    userId: '',
                    createdAt: new Date(),
                    money: 11234,
                    status: 1
                }

                chai
                    .request(app)
                    .post(`/users/saldo`)
                    .send({ payload: payload })
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(500)
                        expect(res.body).to.be.an('object')

                        done()
                    })
            })

        })

    })

    describe(`GET /users/:id for getting user data`, function () {
        describe(`GET /users/:id success case`, function () {
            it(`should send response with status code 200, and is an object when regular user login`, function (done) {
                this.timeout(6000)

                chai
                    .request(app)
                    .get(`/users/${uid}`)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('name')
                        expect(res.body).to.have.property('saldo')
                        expect(res.body.saldo).to.equal('Rp100.000')
                        done()
                    })
            })

        })
        describe(`GET /users/:id failed case`, function () {
            it(`should send response with status code 500 and message 'error', if id dont have saldo`, function (done) {
                this.timeout(6000)

                chai
                    .request(app)
                    .get(`/users/errorSaldo`)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(500)
                        expect(res.body).to.equal('Saldo error!')
                        done()
                    })

            })

            it(`should send response with status code 500 and message 'error', if id dont have completed data`, function (done) {
                this.timeout(6000)

                chai
                    .request(app)
                    .get(`/users/errorFind`)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(500)
                        expect(res.body).to.equal('error find id')
                        done()
                    })

            })
        })
    })

    let orderId
    describe(`POST /users/order for create order`, function () {
        describe(`POST /users/order success case`, function () {
            it(`should send response with status code 200, and send an object`, function (done) {
                this.timeout(6000)
                let payload = {
                    userId: uid,
                    createdAt: new Date(),
                    status: 1
                }

                chai
                    .request(app)
                    .post(`/users/order`)
                    .send({ payload: payload })
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('string')
                        orderId = res.body
                        done()
                    })
            })
        })

        describe(`POST /users/order fail case`, function () {
            it(`should send response with status code 500`, function (done) {
                this.timeout(6000)
                let payload = {
                    userId: '',
                    createdAt: new Date(),
                    status: 1
                }

                chai
                    .request(app)
                    .post(`/users/order`)
                    .send({ payload: '' })
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(500)
                        // expect(res.body).to.be.an('string')
                        // orderId = res.body
                        done()
                    })
            })
        })

    })

    describe(`GET /users/order/:id for create order`, function () {
        describe(`GET /users/order/:id success case`, function () {
            it(`should send response with status code 200, and send an object`, function (done) {
                this.timeout(6000)

                chai
                    .request(app)
                    .get(`/users/order/${orderId}`)

                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('createdAt')
                        expect(res.body).to.have.property('status')

                        done()
                    })
            })
        })

        describe(`GET /users/order/:id fail case`, function () {
            it(`should send response with status code 500`, function (done) {
                this.timeout(6000)

                chai
                    .request(app)
                    .get(`/users/order/cekdoang`)

                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(500)

                        done()
                    })
            })
        })

    })

    describe(`POST /qr/ for create order`, function () {
        describe(`POST /qr/ success case`, function () {
            it(`should send response with status code 200, and send an object`, function (done) {
                this.timeout(6000)
                let payload = {
                    userId: uid,
                    table: 1,

                }

                chai
                    .request(app)
                    .post(`/qr/`)
                    .send(payload)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('valid')
                        expect(res.body.valid).to.equal(1)

                        done()
                    })
            })
        })

        describe(`POST /qr/ failed case`, function () {
            it(`should send response with status code 200, and send an object`, function (done) {
                this.timeout(6000)
                let payload = {
                    userId: uid,
                    table: "",

                }

                chai
                    .request(app)
                    .post(`/qr/`)
                    .send(payload)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('valid')
                        expect(res.body.valid).to.equal(0)

                        done()
                    })
            })

            // it(`should send response with status code 500, and send an object`, function (done) {
            //     this.timeout(6000)
            //     let payload = {
            //         userId: uid,
            //         table: "",

            //     }

            //     chai
            //         .request(app)
            //         .post(`/qr/`)
            //         // .send(payload)
            //         .end(function (err, res) {
            //             expect(err).to.be.null
            //             expect(res).to.have.status(500)
            //             expect(res.body).to.be.an('object')
            //             // expect(res.body).to.have.property('valid')
            //             // expect(res.body.valid).to.equal(0)

            //             done()
            //         })
            // })
        })

    })

    describe(`GET /qr/:table for create order`, function () {
        describe(`GET /qr/:table success case`, function () {
            it(`should send response with status code 200, and send an object`, function (done) {
                this.timeout(6000)
                let table = 1
                chai
                    .request(app)
                    .get(`/qr/${table}`)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res).to.be.html

                        done()
                    })
            })
        })

        describe(`GET /qr/ failed case`, function () {
            it(`should send response with status code 200, and send an object`, function (done) {
                this.timeout(6000)
                let table = ''

                chai
                    .request(app)
                    .get(`/qr/${table}`)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(404)
                        done()
                    })
            })
        })

    })

    describe(`GET /allbalance/:id for find total balance`, function () {
        describe(`GET /allbalance/:id  success case`, function () {
            it(`should send response with status code 200, and send an object`, function (done) {
                this.timeout(6000)

                chai
                    .request(app)
                    .get(`/users/allbalance/${uid}`)
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('array')
                        done()
                    })
            })
        })


    })

    describe(`POST /users/logout for user logout`, function () {
        describe(`POST /users/logout success case`, function () {
            it(`should send response with status code 200, and is an object when user logout`, function (done) {
                this.timeout(6000)

                chai
                    .request(app)
                    .get('/users/logout')
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal(`user ${userEmail} successs log out`)

                        done()
                    })
            })
        })


    })


})
