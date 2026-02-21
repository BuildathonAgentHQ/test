import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

public class BinaryTreeTest {
    
    private BinaryTree tree;
    
    @BeforeEach
    void setUp() {
        tree = new BinaryTree();
    }
    
    @Test
    @DisplayName("Test insertion into empty tree")
    void testInsertionIntoEmptyTree() {
        assertTrue(tree.insert(10));
        assertFalse(tree.isEmpty());
        assertEquals(1, tree.size());
        assertTrue(tree.contains(10));
    }
    
    @Test
    @DisplayName("Test multiple insertions")
    void testMultipleInsertions() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        for (int value : values) {
            assertTrue(tree.insert(value));
        }
        
        assertEquals(values.length, tree.size());
        
        for (int value : values) {
            assertTrue(tree.contains(value));
        }
    }
    
    @Test
    @DisplayName("Test insertion of duplicate values")
    void testDuplicateInsertion() {
        assertTrue(tree.insert(25));
        assertFalse(tree.insert(25)); // Should not allow duplicates
        assertEquals(1, tree.size());
    }
    
    @Test
    @DisplayName("Test search functionality")
    void testSearch() {
        int[] values = {15, 10, 20, 8, 12, 25};
        
        for (int value : values) {
            tree.insert(value);
        }
        
        // Test existing values
        for (int value : values) {
            assertTrue(tree.contains(value));
            assertNotNull(tree.search(value));
        }
        
        // Test non-existing values
        assertFalse(tree.contains(100));
        assertNull(tree.search(100));
        assertFalse(tree.contains(-5));
        assertNull(tree.search(-5));
    }
    
    @Test
    @DisplayName("Test deletion of leaf nodes")
    void testDeleteLeafNodes() {
        int[] values = {50, 30, 70, 20, 40};
        
        for (int value : values) {
            tree.insert(value);
        }
        
        // Delete leaf nodes
        assertTrue(tree.delete(20));
        assertFalse(tree.contains(20));
        assertEquals(4, tree.size());
        
        assertTrue(tree.delete(40));
        assertFalse(tree.contains(40));
        assertEquals(3, tree.size());
    }
    
    @Test
    @DisplayName("Test deletion of nodes with one child")
    void testDeleteNodeWithOneChild() {
        tree.insert(50);
        tree.insert(30);
        tree.insert(70);
        tree.insert(20);
        tree.insert(80);
        
        // Delete node with one child
        assertTrue(tree.delete(30));
        assertFalse(tree.contains(30));
        assertTrue(tree.contains(20)); // Child should still exist
        assertEquals(4, tree.size());
    }
    
    @Test
    @DisplayName("Test deletion of nodes with two children")
    void testDeleteNodeWithTwoChildren() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        for (int value : values) {
            tree.insert(value);
        }
        
        // Delete node with two children
        assertTrue(tree.delete(30));
        assertFalse(tree.contains(30));
        
        // All other nodes should still exist
        int[] remaining = {50, 70, 20, 40, 60, 80};
        for (int value : remaining) {
            assertTrue(tree.contains(value));
        }
        
        assertEquals(6, tree.size());
    }
    
    @Test
    @DisplayName("Test deletion of root node")
    void testDeleteRootNode() {
        tree.insert(50);
        tree.insert(30);
        tree.insert(70);
        
        assertTrue(tree.delete(50));
        assertFalse(tree.contains(50));
        assertTrue(tree.contains(30));
        assertTrue(tree.contains(70));
        assertEquals(2, tree.size());
    }
    
    @Test
    @DisplayName("Test deletion of non-existing node")
    void testDeleteNonExistingNode() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        
        assertFalse(tree.delete(100));
        assertEquals(3, tree.size());
    }
    
    @Test
    @DisplayName("Test tree traversals")
    void testTraversals() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        for (int value : values) {
            tree.insert(value);
        }
        
        // Test in-order traversal (should be sorted)
        int[] inOrder = tree.inOrderTraversal();
        int[] expectedInOrder = {20, 30, 40, 50, 60, 70, 80};
        assertArrayEquals(expectedInOrder, inOrder);
        
        // Test pre-order traversal
        int[] preOrder = tree.preOrderTraversal();
        assertEquals(50, preOrder[0]); // Root should be first
        
        // Test post-order traversal
        int[] postOrder = tree.postOrderTraversal();
        assertEquals(50, postOrder[postOrder.length - 1]); // Root should be last
    }
    
    @Test
    @DisplayName("Test tree height calculation")
    void testTreeHeight() {
        assertEquals(-1, tree.getHeight()); // Empty tree
        
        tree.insert(50);
        assertEquals(0, tree.getHeight()); // Single node
        
        tree.insert(30);
        tree.insert(70);
        assertEquals(1, tree.getHeight()); // Balanced tree with 3 nodes
        
        tree.insert(20);
        tree.insert(10);
        assertEquals(2, tree.getHeight()); // Left-heavy tree
    }
    
    @Test
    @DisplayName("Test minimum and maximum values")
    void testMinMaxValues() {
        assertThrows(IllegalStateException.class, () -> tree.findMin());
        assertThrows(IllegalStateException.class, () -> tree.findMax());
        
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        for (int value : values) {
            tree.insert(value);
        }
        
        assertEquals(20, tree.findMin());
        assertEquals(80, tree.findMax());
    }
    
    @Test
    @DisplayName("Test tree balance validation")
    void testTreeBalance() {
        // Test balanced tree
        int[] balancedValues = {50, 30, 70, 20, 40, 60, 80};
        for (int value : balancedValues) {
            tree.insert(value);
        }
        assertTrue(tree.isBalanced());
        
        // Create unbalanced tree
        BinaryTree unbalancedTree = new BinaryTree();
        for (int i = 1; i <= 5; i++) {
            unbalancedTree.insert(i);
        }
        assertFalse(unbalancedTree.isBalanced());
    }
    
    @Test
    @DisplayName("Test tree validation (BST property)")
    void testBSTValidation() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        for (int value : values) {
            tree.insert(value);
        }
        
        assertTrue(tree.isValidBST());
    }
    
    @Test
    @DisplayName("Test edge cases")
    void testEdgeCases() {
        // Test with negative numbers
        assertTrue(tree.insert(-10));
        assertTrue(tree.insert(-20));
        assertTrue(tree.insert(0));
        
        assertTrue(tree.contains(-10));
        assertTrue(tree.contains(-20));
        assertTrue(tree.contains(0));
        
        // Test with large numbers
        assertTrue(tree.insert(Integer.MAX_VALUE));
        assertTrue(tree.insert(Integer.MIN_VALUE));
        
        assertTrue(tree.contains(Integer.MAX_VALUE));
        assertTrue(tree.contains(Integer.MIN_VALUE));
    }
    
    @Test
    @DisplayName("Test tree clearing")
    void testClear() {
        int[] values = {50, 30, 70, 20, 40};
        
        for (int value : values) {
            tree.insert(value);
        }
        
        assertFalse(tree.isEmpty());
        assertEquals(5, tree.size());
        
        tree.clear();
        
        assertTrue(tree.isEmpty());
        assertEquals(0, tree.size());
        assertEquals(-1, tree.getHeight());
    }
    
    @Test
    @DisplayName("Test performance with large dataset")
    void testPerformance() {
        long startTime = System.currentTimeMillis();
        
        // Insert 1000 random values
        for (int i = 0; i < 1000; i++) {
            tree.insert((int) (Math.random() * 10000));
        }
        
        long insertTime = System.currentTimeMillis() - startTime;
        
        startTime = System.currentTimeMillis();
        
        // Perform 1000 searches
        for (int i = 0; i < 1000; i++) {
            tree.contains((int) (Math.random() * 10000));
        }
        
        long searchTime = System.currentTimeMillis() - startTime;
        
        // Basic performance assertions (adjust thresholds as needed)
        assertTrue(insertTime < 1000, "Insert operations took too long: " + insertTime + "ms");
        assertTrue(searchTime < 100, "Search operations took too long: " + searchTime + "ms");
    }
}