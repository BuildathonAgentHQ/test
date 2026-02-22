#include <iostream>

// Error: Double deletion / use after free
int main() {
    int* ptr = new int(42);
    
    std::cout << "Value: " << *ptr << std::endl;
    delete ptr;  // First deletion
    
    // Error: accessing deleted memory
    std::cout << "After delete: " << *ptr << std::endl;
    
    // Error: double deletion
    delete ptr;
    
    return 0;
}
