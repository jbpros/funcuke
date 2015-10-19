import fs from 'fs'
import Gherkin from 'gherkin'

let gherkinParser = new Gherkin.Parser()
let gherkinCompiler = new Gherkin.Compiler()

let compilePickle = (featureSource) => {
  let feature = gherkinParser.parse(featureSource)
  let pickle = gherkinCompiler.compile(feature, 'xxx.feature')
  return Promise.resolve(pickle)
}

let compilePickles = (featureSources, pickles = []) => {
  if (featureSources.length == 0) return Promise.all(pickles)
  let [featureSource, ...remainingFeatureSources] = featureSources
  pickles = [...pickles, compilePickle(featureSource)]
  return compilePickles(remainingFeatureSources, pickles)
}

let createTestCases = (pickles, glue) => {
  return Promise.all([pickles, glue])
    .then(([pickles, glue]) => ["TODO:TEST CASE", pickles.length, glue])
}

let executeTestCases = (testCases, results) => {
  return Promise.resolve(testCases)
    .then((testCases) => {
      console.log('TEST CASES', testCases)
    })
    .then(() => 0)
}

export default {
  execute (featureSources, stepDefinitions) {
    let pickles   = compilePickles(featureSources)
    let testCases = createTestCases(pickles, "TODO:GLUE")
    return executeTestCases(testCases)
  }
}
