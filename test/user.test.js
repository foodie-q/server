const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')

const { createOrder } = require('../helpers/firebase/orders')
const { dbUsers, auth } = require('../helpers/firebase/index')
const { getSaldo } = require('../helpers/firebase/users')

chai.use(chaiHttp)

var admin = require('firebase-admin');
var serviceAccount = require('../../../key/final-project-anton-zul-felix-firebase-adminsdk-tn10l-3618656653.json')
var defApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://final-project-anton-zul-felix.firebaseio.com"
})

// console.log(defApp.name)



// create User
let uid
describe(`testing endpoint user`, function () {
    //clear data

    after(function (done) {
        let prom1 = defApp.auth().deleteUser(uid)
        let prom2 = dbUsers.doc(uid).delete()
        Promise.all([prom1,prom2])
            .then(() => {
                done()
            })
        
    })
    let userEmail
    let userPass

    describe(`POST /users/ for create new user`, function () {
        describe(`POST /users/ success case`, function () {
            it(`should send response with status code 201, and is an object when create regular user`, function (done) {
                this.timeout(6000)
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

        describe(`POST /users/ failed case`, function () {
            it(`should send response with status code 500 and send message 'Password should be at least 6 characters' when user input wrong password`, function (done) {
                this.timeout(6000)
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

    // describe(`GET /saldo/:id for user getting balance`, function () {
    //     describe(`GET /saldo/:id success case`, function () {
    //         it(`should send response with status code 200, and send an object`, function (done) {
    //             this.timeout(6000)

    //             chai
    //                 .request(app)
    //                 .get(`/saldo/${uid}`)
    //                 .end(function (err, res) {
    //                     expect(err).to.be.null
    //                     expect(res).to.have.status(200)
    //                     expect(res.body).to.be.an('number')
    //                     expect(res.body).to.equal(1000)
    //                     // expect(res.body.message).to.equal(`user ${userEmail} successs log out`)
                        
    //                     done()
    //                 })
    //         })
    //     })

       
    // })

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