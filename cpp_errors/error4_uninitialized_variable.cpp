#include <iostream>

// Error: Use of uninitialized variable
int main() {
    int x;  // Not initialized
    int y;  // Not initialized
    
    // Using uninitialized variables - undefined behavior
    int sum = x + y;
    
    std::cout << "Sum: " << sum << std::endl;
    std::cout << "Variable x contains: " << x << std::endl;
    
    return 0;
}
