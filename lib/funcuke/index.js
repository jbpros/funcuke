import Pickles from './pickles'

let run = (featureSources, stepDefinitions) => {
  let pickles = Pickles.compile(featureSources)
  return Promise.resolve(0)
}

export default { run }
export { Pickles }
