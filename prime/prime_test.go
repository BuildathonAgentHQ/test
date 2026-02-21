package prime

import (
	"testing"
)

// TestIsPrime tests the IsPrime function with various inputs
func TestIsPrime(t *testing.T) {
	tests := []struct {
		name     string
		input    int
		expected bool
	}{
		// Edge cases
		{"negative number", -5, false},
		{"zero", 0, false},
		{"one", 1, false},
		
		// Small primes
		{"two", 2, true},
		{"three", 3, true},
		{"five", 5, true},
		{"seven", 7, true},
		{"eleven", 11, true},
		{"thirteen", 13, true},
		
		// Small composites
		{"four", 4, false},
		{"six", 6, false},
		{"eight", 8, false},
		{"nine", 9, false},
		{"ten", 10, false},
		{"twelve", 12, false},
		{"fifteen", 15, false},
		
		// Perfect squares
		{"sixteen", 16, false},
		{"twenty-five", 25, false},
		{"thirty-six", 36, false},
		{"forty-nine", 49, false},
		{"sixty-four", 64, false},
		{"eighty-one", 81, false},
		{"one hundred", 100, false},
		
		// Larger primes
		{"seventeen", 17, true},
		{"nineteen", 19, true},
		{"twenty-three", 23, true},
		{"twenty-nine", 29, true},
		{"thirty-one", 31, true},
		{"thirty-seven", 37, true},
		{"forty-one", 41, true},
		{"forty-three", 43, true},
		{"forty-seven", 47, true},
		{"ninety-seven", 97, true},
		{"one hundred one", 101, true},
		
		// Larger composites
		{"twenty-one", 21, false},
		{"twenty-seven", 27, false},
		{"thirty-three", 33, false},
		{"thirty-nine", 39, false},
		{"fifty-one", 51, false},
		{"fifty-seven", 57, false},
		{"sixty-three", 63, false},
		{"sixty-nine", 69, false},
		{"ninety-one", 91, false},
		{"ninety-nine", 99, false},
		
		// Numbers ending in 5 (except 5)
		{"twenty-five", 25, false},
		{"thirty-five", 35, false},
		{"forty-five", 45, false},
		{"fifty-five", 55, false},
		{"sixty-five", 65, false},
		{"seventy-five", 75, false},
		{"eighty-five", 85, false},
		{"ninety-five", 95, false},
		
		// Even numbers (except 2)
		{"fourteen", 14, false},
		{"eighteen", 18, false},
		{"twenty-two", 22, false},
		{"twenty-six", 26, false},
		{"thirty", 30, false},
		{"fifty", 50, false},
		{"one hundred two", 102, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := IsPrime(tt.input)
			if result != tt.expected {
				t.Errorf("IsPrime(%d) = %v; want %v", tt.input, result, tt.expected)
			}
		})
	}
}

// TestIsPrimeLargeNumbers tests with larger numbers to verify performance
func TestIsPrimeLargeNumbers(t *testing.T) {
	tests := []struct {
		name     string
		input    int
		expected bool
	}{
		{"large prime 1009", 1009, true},
		{"large prime 1013", 1013, true},
		{"large composite 1001", 1001, false},
		{"large composite 1000", 1000, false},
		{"large prime 7919", 7919, true},
		{"large composite 7920", 7920, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := IsPrime(tt.input)
			if result != tt.expected {
				t.Errorf("IsPrime(%d) = %v; want %v", tt.input, result, tt.expected)
			}
		})
	}
}

// BenchmarkIsPrime benchmarks the IsPrime function
func BenchmarkIsPrime(b *testing.B) {
	testCases := []int{2, 17, 97, 1009, 7919}
	
	for _, n := range testCases {
		b.Run(fmt.Sprintf("n=%d", n), func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				IsPrime(n)
			}
		})
	}
}

// TestPrimeFactors tests prime factorization if such function exists
func TestPrimeFactors(t *testing.T) {
	// Skip if PrimeFactors function doesn't exist
	if !hasPrimeFactorsFunction() {
		t.Skip("PrimeFactors function not found")
	}
	
	tests := []struct {
		name     string
		input    int
		expected []int
	}{
		{"prime number", 7, []int{7}},
		{"composite number", 12, []int{2, 2, 3}},
		{"perfect square", 16, []int{2, 2, 2, 2}},
		{"large composite", 60, []int{2, 2, 3, 5}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// This would need to be implemented based on actual function signature
			// result := PrimeFactors(tt.input)
			// if !reflect.DeepEqual(result, tt.expected) {
			//     t.Errorf("PrimeFactors(%d) = %v; want %v", tt.input, result, tt.expected)
			// }
		})
	}
}

// Helper function to check if PrimeFactors exists
func hasPrimeFactorsFunction() bool {
	// This would need reflection or build tags to determine
	return false
}

// TestNextPrime tests finding next prime if such function exists
func TestNextPrime(t *testing.T) {
	// Skip if NextPrime function doesn't exist
	if !hasNextPrimeFunction() {
		t.Skip("NextPrime function not found")
	}
	
	tests := []struct {
		name     string
		input    int
		expected int
	}{
		{"after 1", 1, 2},
		{"after 2", 2, 3},
		{"after 10", 10, 11},
		{"after 13", 13, 17},
		{"after 20", 20, 23},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// This would need to be implemented based on actual function signature
			// result := NextPrime(tt.input)
			// if result != tt.expected {
			//     t.Errorf("NextPrime(%d) = %d; want %d", tt.input, result, tt.expected)
			// }
		})
	}
}

// Helper function to check if NextPrime exists
func hasNextPrimeFunction() bool {
	// This would need reflection or build tags to determine
	return false
}