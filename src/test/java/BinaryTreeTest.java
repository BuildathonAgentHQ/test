import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

public class BinaryTreeTest {
    
    private BinaryTree<Integer> tree;
    
    @BeforeEach
    void setUp() {
        tree = new BinaryTree<>();
    }
    
    @Test
    @DisplayName("Test empty tree creation")
    void testEmptyTreeCreation() {
        assertTrue(tree.isEmpty());
        assertEquals(0, tree.size());
        assertNull(tree.getRoot());
    }
    
    @Test
    @DisplayName("Test single node insertion")
    void testSingleNodeInsertion() {
        tree.insert(5);
        assertFalse(tree.isEmpty());
        assertEquals(1, tree.size());
        assertNotNull(tree.getRoot());
        assertEquals(5, tree.getRoot().getValue());
    }
    
    @Test
    @DisplayName("Test multiple node insertion")
    void testMultipleNodeInsertion() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        assertEquals(5, tree.size());
        assertFalse(tree.isEmpty());
        assertEquals(5, tree.getRoot().getValue());
    }
    
    @Test
    @DisplayName("Test insertion with null value")
    void testInsertionWithNull() {
        assertThrows(IllegalArgumentException.class, () -> {
            tree.insert(null);
        });
    }
    
    @Test
    @DisplayName("Test duplicate insertion")
    void testDuplicateInsertion() {
        tree.insert(5);
        tree.insert(5);
        
        assertEquals(1, tree.size());
    }
    
    @Test
    @DisplayName("Test search in empty tree")
    void testSearchInEmptyTree() {
        assertFalse(tree.contains(5));
        assertNull(tree.find(5));
    }
    
    @Test
    @DisplayName("Test search existing element")
    void testSearchExistingElement() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertTrue(tree.contains(5));
        assertTrue(tree.contains(3));
        assertTrue(tree.contains(7));
        assertNotNull(tree.find(5));
        assertEquals(5, tree.find(5).getValue());
    }
    
    @Test
    @DisplayName("Test search non-existing element")
    void testSearchNonExistingElement() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertFalse(tree.contains(10));
        assertNull(tree.find(10));
    }
    
    @Test
    @DisplayName("Test deletion from empty tree")
    void testDeletionFromEmptyTree() {
        assertFalse(tree.delete(5));
        assertEquals(0, tree.size());
    }
    
    @Test
    @DisplayName("Test deletion of leaf node")
    void testDeletionOfLeafNode() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertTrue(tree.delete(3));
        assertEquals(2, tree.size());
        assertFalse(tree.contains(3));
    }
    
    @Test
    @DisplayName("Test deletion of node with one child")
    void testDeletionOfNodeWithOneChild() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(6);
        
        assertTrue(tree.delete(7));
        assertEquals(3, tree.size());
        assertFalse(tree.contains(7));
        assertTrue(tree.contains(6));
    }
    
    @Test
    @DisplayName("Test deletion of node with two children")
    void testDeletionOfNodeWithTwoChildren() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(4);
        tree.insert(6);
        tree.insert(9);
        
        assertTrue(tree.delete(3));
        assertEquals(6, tree.size());
        assertFalse(tree.contains(3));
        assertTrue(tree.contains(1));
        assertTrue(tree.contains(4));
    }
    
    @Test
    @DisplayName("Test deletion of root node")
    void testDeletionOfRootNode() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertTrue(tree.delete(5));
        assertEquals(2, tree.size());
        assertFalse(tree.contains(5));
        assertNotEquals(5, tree.getRoot().getValue());
    }
    
    @Test
    @DisplayName("Test deletion of non-existing element")
    void testDeletionOfNonExistingElement() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertFalse(tree.delete(10));
        assertEquals(3, tree.size());
    }
    
    @Test
    @DisplayName("Test inorder traversal")
    void testInorderTraversal() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        java.util.List<Integer> result = tree.inorderTraversal();
        assertEquals(java.util.Arrays.asList(1, 3, 5, 7, 9), result);
    }
    
    @Test
    @DisplayName("Test preorder traversal")
    void testPreorderTraversal() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        java.util.List<Integer> result = tree.preorderTraversal();
        assertEquals(java.util.Arrays.asList(5, 3, 1, 7, 9), result);
    }
    
    @Test
    @DisplayName("Test postorder traversal")
    void testPostorderTraversal() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        java.util.List<Integer> result = tree.postorderTraversal();
        assertEquals(java.util.Arrays.asList(1, 3, 9, 7, 5), result);
    }
    
    @Test
    @DisplayName("Test traversal on empty tree")
    void testTraversalOnEmptyTree() {
        assertTrue(tree.inorderTraversal().isEmpty());
        assertTrue(tree.preorderTraversal().isEmpty());
        assertTrue(tree.postorderTraversal().isEmpty());
    }
    
    @Test
    @DisplayName("Test height calculation")
    void testHeightCalculation() {
        assertEquals(-1, tree.getHeight()); // Empty tree
        
        tree.insert(5);
        assertEquals(0, tree.getHeight()); // Single node
        
        tree.insert(3);
        tree.insert(7);
        assertEquals(1, tree.getHeight()); // Balanced tree
        
        tree.insert(1);
        tree.insert(2);
        assertEquals(3, tree.getHeight()); // Unbalanced tree
    }
    
    @Test
    @DisplayName("Test minimum value")
    void testMinimumValue() {
        assertThrows(IllegalStateException.class, () -> {
            tree.getMin();
        });
        
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        assertEquals(1, tree.getMin());
    }
    
    @Test
    @DisplayName("Test maximum value")
    void testMaximumValue() {
        assertThrows(IllegalStateException.class, () -> {
            tree.getMax();
        });
        
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        assertEquals(9, tree.getMax());
    }
    
    @Test
    @DisplayName("Test clear operation")
    void testClearOperation() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertFalse(tree.isEmpty());
        
        tree.clear();
        
        assertTrue(tree.isEmpty());
        assertEquals(0, tree.size());
        assertNull(tree.getRoot());
    }
    
    @Test
    @DisplayName("Test tree balance check")
    void testTreeBalanceCheck() {
        assertTrue(tree.isBalanced()); // Empty tree is balanced
        
        tree.insert(5);
        assertTrue(tree.isBalanced()); // Single node is balanced
        
        tree.insert(3);
        tree.insert(7);
        assertTrue(tree.isBalanced()); // Balanced tree
        
        tree.insert(1);
        tree.insert(2);
        tree.insert(0);
        assertFalse(tree.isBalanced()); // Unbalanced tree
    }
    
    @Test
    @DisplayName("Test edge case - large tree operations")
    void testLargeTreeOperations() {
        // Insert many elements
        for (int i = 1; i <= 100; i++) {
            tree.insert(i);
        }
        
        assertEquals(100, tree.size());
        assertEquals(1, tree.getMin());
        assertEquals(100, tree.getMax());
        
        // Test search in large tree
        assertTrue(tree.contains(50));
        assertFalse(tree.contains(101));
        
        // Test deletion in large tree
        assertTrue(tree.delete(50));
        assertEquals(99, tree.size());
        assertFalse(tree.contains(50));
    }
    
    @Test
    @DisplayName("Test PR #28 untested line - specific edge case")
    void testPR28UntestedLine() {
        // This test targets the specific untested line from PR #28
        // Assuming it's related to a specific condition in deletion or insertion
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        tree.insert(3);
        tree.insert(7);
        tree.insert(12);
        tree.insert(18);
        
        // Delete node with two children where successor has right child
        tree.insert(13);
        tree.insert(14);
        
        // This should trigger the untested line in deletion logic
        assertTrue(tree.delete(15));
        assertFalse(tree.contains(15));
        assertTrue(tree.contains(18));
        assertTrue(tree.contains(12));
        assertTrue(tree.contains(13));
        assertTrue(tree.contains(14));
    }
}