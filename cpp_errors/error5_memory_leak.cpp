#include <iostream>

// Error: Memory leak
int main() {
    // Allocating memory but never freeing it
    int* ptr = new int[1000];
    ptr[0] = 42;
    
    std::cout << "Pointer value: " << ptr[0] << std::endl;
    
    // Memory not deallocated - memory leak!
    return 0;
}
