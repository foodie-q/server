const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')

const NumberToRupiah = require('../helpers/numberToRupiah')
chai.use(chaiHttp)




// create User
let menuid
describe(`testing endpoint index`, function () {
    //clear data
    
    let newMenu
    describe(`GET / `, function () {
        describe(`GET / success case`, function () {
            it(`should send response with status code 200, and is an object when create menu`, function (done) {
                this.timeout(10000)
                chai
                    .request(app)
                    .get('/i')
                    .end(function (err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('object')
                        console.log(res.body)
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.be.equal('index')
                        done()
                    })
            })

        })

    })

    describe(`Test function `, function () {
        describe(`Test function number to rupiah`, function () {
            it(`expect result to be string if input is number`, function (done) {
                    let result = NumberToRupiah(1000000)
                    expect(result).to.be.an('string')
                    expect(result).to.equal('Rp1.000.000')
                        done()
                    })
            })
            it(`should return 0 if input is null`, function (done) {
                    let result = NumberToRupiah()
                    expect(result).to.be.an('string')
                    expect(result).to.equal('Rp0')
                        done()
                    })
            

        })
    })

   

