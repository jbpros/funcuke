Feature:

  Scenario: success
    Given the following feature:
      """
      Feature: F1
        Scenario: S1.1
          Given A
          When B
          Then C

        Scenario: S1.2
          Given D
          When E
          Then F
      """
    And the following feature:
      """
      Feature: F2
        Scenario: S2
          Given G
          When H
          Then I
      """
    And the following step definitions:
      | .* | () => {} |
    When Funcuke runs
    Then Funcuke should succeed

  Scenario: failure
    Given the following feature:
      """
      Feature: F3
        Scenario: S3
          Given A
          When B
          Then C
      """
    And the following step definitions:
      | .* | () => {} |
    When Funcuke runs
    Then Funcuke should fail
