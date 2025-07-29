Feature: Product Management

  Background:
    Given I am logged in as a registered user

  Scenario: View product list
    When I navigate to the product list
    Then I should see the list of products

  Scenario: Create a new product
    When I navigate to the product list
    And I create a new product named "Iphone 16"
    Then the product "Iphone 16" should appear in the list

  Scenario: Update an existing product
    When I navigate to the product list
    And I update the product "Iphone 16" to "Iphone 16 Pro Max"
    Then the product "Iphone 16 Pro Max" should appear in the list
    And the product "Iphone 16" should not be in the list

  Scenario: Delete a product
    When I navigate to the product list
    And I delete the product "Iphone 16 Pro Max"
    Then the product "Iphone 16 Pro Max" should not be in the list

  Scenario: Unregistered user cannot access dashboard
    Given I am not logged in
    When I visit the dashboard
    Then I should be redirected to the login page
