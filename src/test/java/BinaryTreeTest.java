import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

public class BinaryTreeTest {
    
    private BinaryTree<Integer> tree;
    
    @BeforeEach
    void setUp() {
        tree = new BinaryTree<>();
    }
    
    @Test
    void testEmptyTreeCreation() {
        assertTrue(tree.isEmpty());
        assertEquals(0, tree.size());
        assertNull(tree.getRoot());
    }
    
    @Test
    void testSingleNodeInsertion() {
        tree.insert(5);
        assertFalse(tree.isEmpty());
        assertEquals(1, tree.size());
        assertNotNull(tree.getRoot());
        assertEquals(Integer.valueOf(5), tree.getRoot().getValue());
    }
    
    @Test
    void testMultipleNodeInsertion() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        assertEquals(5, tree.size());
        assertFalse(tree.isEmpty());
    }
    
    @Test
    void testSearchExistingElement() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertTrue(tree.contains(5));
        assertTrue(tree.contains(3));
        assertTrue(tree.contains(7));
    }
    
    @Test
    void testSearchNonExistingElement() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertFalse(tree.contains(10));
        assertFalse(tree.contains(1));
        assertFalse(tree.contains(null));
    }
    
    @Test
    void testSearchInEmptyTree() {
        assertFalse(tree.contains(5));
        assertFalse(tree.contains(null));
    }
    
    @Test
    void testDeleteLeafNode() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertTrue(tree.delete(3));
        assertFalse(tree.contains(3));
        assertEquals(2, tree.size());
    }
    
    @Test
    void testDeleteNodeWithOneChild() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(6);
        
        assertTrue(tree.delete(7));
        assertFalse(tree.contains(7));
        assertTrue(tree.contains(6));
        assertEquals(3, tree.size());
    }
    
    @Test
    void testDeleteNodeWithTwoChildren() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(4);
        
        assertTrue(tree.delete(3));
        assertFalse(tree.contains(3));
        assertTrue(tree.contains(1));
        assertTrue(tree.contains(4));
        assertEquals(4, tree.size());
    }
    
    @Test
    void testDeleteRootNode() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertTrue(tree.delete(5));
        assertFalse(tree.contains(5));
        assertEquals(2, tree.size());
        assertNotNull(tree.getRoot());
    }
    
    @Test
    void testDeleteNonExistingElement() {
        tree.insert(5);
        tree.insert(3);
        
        assertFalse(tree.delete(10));
        assertEquals(2, tree.size());
    }
    
    @Test
    void testDeleteFromEmptyTree() {
        assertFalse(tree.delete(5));
        assertEquals(0, tree.size());
    }
    
    @Test
    void testInOrderTraversal() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        java.util.List<Integer> result = tree.inOrderTraversal();
        assertEquals(java.util.Arrays.asList(1, 3, 5, 7, 9), result);
    }
    
    @Test
    void testPreOrderTraversal() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        java.util.List<Integer> result = tree.preOrderTraversal();
        assertEquals(java.util.Arrays.asList(5, 3, 1, 7, 9), result);
    }
    
    @Test
    void testPostOrderTraversal() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        java.util.List<Integer> result = tree.postOrderTraversal();
        assertEquals(java.util.Arrays.asList(1, 3, 9, 7, 5), result);
    }
    
    @Test
    void testTraversalOnEmptyTree() {
        assertTrue(tree.inOrderTraversal().isEmpty());
        assertTrue(tree.preOrderTraversal().isEmpty());
        assertTrue(tree.postOrderTraversal().isEmpty());
    }
    
    @Test
    void testHeight() {
        assertEquals(-1, tree.height()); // Empty tree
        
        tree.insert(5);
        assertEquals(0, tree.height()); // Single node
        
        tree.insert(3);
        tree.insert(7);
        assertEquals(1, tree.height()); // Balanced tree
        
        tree.insert(1);
        tree.insert(2);
        assertEquals(3, tree.height()); // Unbalanced tree
    }
    
    @Test
    void testClear() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        tree.clear();
        assertTrue(tree.isEmpty());
        assertEquals(0, tree.size());
        assertNull(tree.getRoot());
    }
    
    @Test
    void testNullInsertion() {
        assertThrows(IllegalArgumentException.class, () -> {
            tree.insert(null);
        });
    }
    
    @Test
    void testDuplicateInsertion() {
        tree.insert(5);
        tree.insert(5); // Duplicate
        
        assertEquals(1, tree.size()); // Should not increase size
        assertTrue(tree.contains(5));
    }
    
    @Test
    void testMinimumValue() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        assertEquals(Integer.valueOf(1), tree.findMin());
    }
    
    @Test
    void testMaximumValue() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        assertEquals(Integer.valueOf(9), tree.findMax());
    }
    
    @Test
    void testMinMaxOnEmptyTree() {
        assertNull(tree.findMin());
        assertNull(tree.findMax());
    }
}