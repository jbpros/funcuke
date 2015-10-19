Feature:

  Scenario: success
    Given the following feature:
      """
      Feature:
        Scenario:
          Given A
          When B
          Then C
      """
    And the following feature:
      """
      Feature:
        Scenario:
          Given D
          When E
          Then F
      """
    And the following step definitions:
      | /.*/ | () => {} |
    When Funcuke runs
    Then Funcuke should succeed

  Scenario: failure
    Given the following feature:
      """
      Feature:
        Scenario:
          Given A
          When B
          Then C
      """
    And the following step definitions:
      | /.*/ | () => {} |
    When Funcuke runs
    Then Funcuke should fail
