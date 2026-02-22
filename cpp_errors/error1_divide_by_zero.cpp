#include <iostream>

// Error: Division by zero
int main() {
    int a = 10;
    int b = 0;
    
    // This will cause runtime error - division by zero
    int result = a / b;
    
    std::cout << "Result: " << result << std::endl;
    return 0;
}
