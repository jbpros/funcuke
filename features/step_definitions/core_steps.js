import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import Funcuke from '../../lib/funcuke'

const expect = chai.expect
chai.use(chaiAsPromised)

export default function () {
  this.Given(/^the following feature:$/, function (featureSource) {
    this.featureSources = this.featureSources || []
    this.featureSources.push(featureSource)
  })

  this.Given(/^the following step definitions:$/, function (stepDefinitions) {
    this.stepDefinitions = []
    stepDefinitions.raw().forEach((stepDefinition) => {
      this.stepDefinitions.push({ regExp: new RegExp(stepDefinition[0]), fn: stepDefinition[1]})
    })
  })

  this.When(/^Funcuke runs$/, function () {
    return this.funcukeRun = Funcuke.run(this.featureSources, this.stepDefinitions)
  })

  this.Then(/^Funcuke should succeed$/, function () {
    return expect(this.funcukeRun).to.eventually.equal(0)
  })

  this.Then(/^Funcuke should fail$/, function () {
    return expect(this.funcukeRun).to.eventually.equal(-1)
  })
}
