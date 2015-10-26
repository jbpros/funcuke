import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Pickles } from '../lib/funcuke'

chai.use(chaiAsPromised)
const expect = chai.expect

const FEATURE_SOURCE_1 = `Feature: F1
  Scenario: S1
    Given A
  Scenario: S2
    Given B`
const FEATURE_SOURCE_2 = `Feature: F2
  Scenario: S3
    Given C
  Scenario: S4
    Given D`

describe("Pickles.compile", () => {
  it("Compiles feature sources into pickles", () => {
    let featureSources = [
      {
        path: 'features/world.feature',
        source: FEATURE_SOURCE_1
      },
      {
        path: 'features/mundo.feature',
        source: FEATURE_SOURCE_2
      }
    ]
    expect(Pickles.compile(featureSources)).to.eventually.equal([
      { path: undefined,
        tags: [],
        name: 'Scenario: S1',
        locations: [ [Object] ],
        steps: [ [Object] ]
      },
      { path: undefined,
        tags: [],
        name: 'Scenario: S2',
        locations: [ [Object] ],
        steps: [ [Object] ]
      }
    ])
  })
})
