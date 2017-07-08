
if (typof module.exports == object) {
	var chai = require ('chai')
	var mocha = require('mocha')
}
var expect = chai.expect
mocha.setup('bdd')

var host = 'localhost'

var creds = { host: host, port: 54321, client: 'myApp1'}

var client = new Cortex({host:host, port: 8000}) 
  
describe("cortex", () => {
    
	describe("discovery", () => {
		it("should have rpc methods", () => expect(client.api).to.exist)
	})
   
	describe("authorize", () => {
  		//it("should fail if no client param",() => client.auth().catch(err => expect(err).to.exist))
  		it("should return an _auth token", () => client.auth(creds).then(_ => expect(client.creds).to.have.property("_auth")))
  		it("should return an expiry date", () => client.auth(creds).then(_ => expect(client.creds).to.have.property("expires")))
	})

	describe("createSession", () => {
  	it("should fail if unauthorized", () => client.call("createSession").catch(_ => expect(_.error).to.exist))
  		it("should return a new session", () => client.auth(creds).then(_ => client.api.createSession()).then(_ => expect(_.headset).to.exist))
	})

	describe("queryHeadsets", () => {
  		it("list should list headsets", () => client.call("queryHeadsets").then(_ => expect(_[0]).to.include.keys(['id','serial','dongle','status'])))
	})

	describe("EEG Data", () => {
  		it("should include time stamps", () => client.on('eeg').then(_ =>  expect(_.time).to.exist))
  		it("should include session Id", () =>  client.on('eeg').then(_ =>  expect(_.sid).to.exist))
  		it("should include eeg samples", () => client.on('eeg').then(_ =>  expect(_.eeg).to.exist))
	})
    
	describe("Facial Expressions", () => {
  		it("should include time stamps", () => client.on('fac').then(_ => expect(_.time).to.exist))
  		it("should include session Id", () =>  client.on('fac').then(_ => expect(_.sid).to.exist))
  		it("should include Expressions", () => client.on('fac').then(_ => expect(_.fac).to.exist))
	})
    
	describe("Inject Markers", () => {
  		it("should fail if no label given", () => client.call('injectMarker').catch(_ => expect(_[0]).to.exist))
  		it("should add markers to session", () => client.call('injectMarker', { label:'testLabel'} )
    		.then(_ => expect(_.markers[_.markers.length-1]).to.have.property('label', 'testLabel'))
 		)
	})
})
mocha.run()
client.auth(creds)
var session = client.newSession({_auth:1})
session.on('fac', console.log, msg => msg.fac.smile > 300)
