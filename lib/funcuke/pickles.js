import Gherkin from 'gherkin'

let gherkinParser = new Gherkin.Parser()
let gherkinCompiler = new Gherkin.Compiler()

let compileFeaturePickles = (featureSource, path) => {
  let feature = gherkinParser.parse(featureSource)
  let pickles = gherkinCompiler.compile(feature, path)
  return Promise.resolve(pickles)
}






let compile = (featureSources) => {
  return compileFeaturePickles(featureSources[0])
    .then((pickles) => {
      console.log(require('util').inspect(pickles))
    })
}

export default { compile }
