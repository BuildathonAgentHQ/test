#include <iostream>

// Error: Stack overflow from infinite recursion
void recursive_function(int n) {
    std::cout << "Recursion depth: " << n << std::endl;
    
    // No base case! Infinite recursion
    recursive_function(n + 1);
}

int main() {
    recursive_function(0);
    return 0;
}
