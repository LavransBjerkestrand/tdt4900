import unittest

# The code you want to test
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

# Create a test class that inherits from unittest.TestCase
class TestMathOperations(unittest.TestCase):

    # Define test methods with names starting with "test_"
    def test_addition(self):
        self.assertEqual(add(1, 2), 3)  # Check if 1 + 2 equals 3

    def test_subtraction(self):
        self.assertEqual(subtract(5, 3), 3)  # Check if 5 - 3 equals 2

if __name__ == '__main__':
    unittest.main()
