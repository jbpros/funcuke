import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import Funcuke from '../lib/funcuke'

chai.use(chaiAsPromised)
const expect = chai.expect

const FEATURE_SOURCE_1 = `Feature: F1
  Scenario: S1
    Given A`

describe("Funcuke#run", () => {
  it("resolves to 0 when it passes", () => {
    let featureSources = [FEATURE_SOURCE_1]
    let stepDefinitions = [[/.*/, () => {}]]
    return expect(Funcuke.run(featureSources, stepDefinitions)).to.eventually.equal(0)
  })

  it("resolves to -1 when it fails", () => {
    let featureSources = [FEATURE_SOURCE_1]
    let stepDefinitions = [[/.*/, () => { throw new Error('I FAIL') }]]
    return expect(Funcuke.run(featureSources, stepDefinitions)).to.eventually.equal(-1)
  })
})
