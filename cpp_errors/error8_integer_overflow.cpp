#include <iostream>

// Error: Integer overflow
int main() {
    int maxInt = 2147483647;  // Maximum value for signed 32-bit int
    
    std::cout << "Before overflow: " << maxInt << std::endl;
    
    // Adding 1 to max int causes overflow
    maxInt = maxInt + 1;
    
    std::cout << "After overflow: " << maxInt << std::endl;
    
    return 0;
}
