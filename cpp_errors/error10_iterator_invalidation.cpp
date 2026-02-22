#include <iostream>
#include <vector>

// Error: Iterator invalidation
int main() {
    std::vector<int> vec = {1, 2, 3, 4, 5};
    
    auto it = vec.begin();
    
    // Modifying vector while iterating - invalidates iterator
    vec.push_back(6);
    
    // Using invalidated iterator - error!
    std::cout << "Value: " << *it << std::endl;
    ++it;
    std::cout << "Next value: " << *it << std::endl;
    
    return 0;
}
