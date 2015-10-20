import fs from 'fs'
import Gherkin from 'gherkin'

let gherkinParser = new Gherkin.Parser()
let gherkinCompiler = new Gherkin.Compiler()

let compilePickle = (featureSource, path) => {
  let feature = gherkinParser.parse(featureSource)
  let pickle = gherkinCompiler.compile(feature, path)
  console.log("PICKLE", pickle)
  return Promise.resolve(pickle)
}

let compilePickles = (featureSources, pickles = []) => {
  if (featureSources.length == 0) return Promise.all(pickles)
  let [featureSource, ...remainingFeatureSources] = featureSources
  pickles = [...pickles, compilePickle(featureSource, 'memory:unknown.feature')] // TODO: pass a better path
  return compilePickles(remainingFeatureSources, pickles)
}

let createTestStep = (matchedArguments, executable, path, locations) => {
  return Promise.resolve({
    matchedArguments,
    executable,
    path,
    locations
  })
}

let createTestStepsFromPickleSteps = (pickleSteps, glue, testSteps = []) => {
  if (pickleSteps.length == 0) return Promise.all(testSteps)
  return Promise.all([pickleSteps, glue])
    .then(([pickleSteps, glue]) => {
      let [pickleStep, ...remainingPickleSteps] = pickleSteps
      testSteps = [...testSteps, createTestStep(pickleStep, executable)]
      return createTestStepsFromPickleSteps(remainingPickleSteps, glue, testSteps)
    })
}

let createTestCase = (pickle, glue) => {
  console.log(pickle)
  return createTestStepsFromPickleSteps(pickle.steps, glue)
    .then((testSteps) => {
      return { testSteps: testSteps, pickle, glue }
    })
}

let createTestCases = (pickles, glue, testCases = []) => {
  if (pickles.length == 0) return Promise.all(testCases)
  return Promise.all([pickles, glue])
    .then(([pickles, glue]) => {
      let [pickle, ...remainingPickles] = pickles
      testCases = [...testCases, createTestCase(pickle, glue)]
      return createTestCases(remainingPickles, glue, testCases)
    })
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
