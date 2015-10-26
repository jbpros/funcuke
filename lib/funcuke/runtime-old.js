import fs from 'fs'
import Gherkin from 'gherkin'

let gherkinParser = new Gherkin.Parser()
let gherkinCompiler = new Gherkin.Compiler()

let compileFeaturePickles = (featureSource, path) => {
  let feature = gherkinParser.parse(featureSource)
  let pickles = gherkinCompiler.compile(feature, path)
  return Promise.resolve(pickles)
}

let compilePickles = (featureSources, pickles = []) => {
  if (featureSources.length == 0) return Promise.all(pickles)
  let [featureSource, ...remainingFeatureSources] = featureSources
  return compileFeaturePickles(featureSource, 'memory:unknown.feature')
    .then((featurePickles) => {
      pickles = [...pickles, ...featurePickles] // TODO: pass a better path
      return compilePickles(remainingFeatureSources, pickles)
    })
}

let assembleGlue = (stepDefinitions) => {
  return Promise.resolve({ stepDefinitions })
}

let matchStepDefinitions = (stepDefinitions, pickleStep, matches = []) => {
  if (stepDefinitions.length == 0) return Promise.all(matches)
  let [stepDefinition, ...remainingStepDefinitions] = stepDefinitions
  let matchedArguments = stepDefinition.regExp.exec(pickleStep.text)
  if (matchedArguments)
    matches = [...matches, { stepDefinition, matchedArguments }]
  return matchStepDefinitions(remainingStepDefinitions, pickleStep, matches)
}

let createTestStep = (pickleStep, glue) => {
  return matchStepDefinitions(glue.stepDefinitions, pickleStep)
    .then((stepDefinitionMatches) => {
      let path = 'TODO:path'
      let locations = 'TODO:locations'

      if (stepDefinitionMatches.length > 1)
        return Promise.reject(new Error(`Ambiguous step: ${pickleStep.text}`))
      else if (stepDefinitionMatches.length == 1) {
        let stepDefinitionMatch = stepDefinitionMatches[0]
        return Promise.resolve({
          matchedArguments: stepDefinitionMatch.matchedArguments,
          fn: stepDefinitionMatch.stepDefinition.fn,
          path,
          locations
        })
      }
    })
}

let createTestStepsFromPickleSteps = (pickleSteps, glue, testSteps = []) => {
  if (pickleSteps.length == 0) return Promise.all(testSteps)
  return Promise.all([pickleSteps, glue])
    .then(([pickleSteps, glue]) => {
      let [pickleStep, ...remainingPickleSteps] = pickleSteps
      testSteps = [...testSteps, createTestStep(pickleStep, glue)]
      return createTestStepsFromPickleSteps(remainingPickleSteps, glue, testSteps)
    })
}

let createTestCase = (pickle, glue) => {
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
      console.log('TEST CASES', testCases[0].testSteps)
    })
    .then(() => 0)
}

export default {
  execute (featureSources, stepDefinitions) {
    let pickles   = compilePickles(featureSources)
    let glue      = assembleGlue(stepDefinitions)
    let testCases = createTestCases(pickles, glue)
    return executeTestCases(testCases)
  }
}
