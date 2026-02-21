import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

public class BinaryTreeTest {
    
    private BinaryTree tree;
    
    @BeforeEach
    void setUp() {
        tree = new BinaryTree();
    }
    
    @Test
    void testEmptyTreeCreation() {
        assertNotNull(tree);
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
        assertEquals(5, tree.getRoot().getValue());
    }
    
    @Test
    void testMultipleNodeInsertion() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        assertEquals(5, tree.size());
        assertTrue(tree.contains(5));
        assertTrue(tree.contains(3));
        assertTrue(tree.contains(7));
        assertTrue(tree.contains(1));
        assertTrue(tree.contains(9));
    }
    
    @Test
    void testDuplicateInsertion() {
        tree.insert(5);
        tree.insert(5);
        
        assertEquals(1, tree.size());
        assertTrue(tree.contains(5));
    }
    
    @Test
    void testContainsNonExistentElement() {
        tree.insert(5);
        tree.insert(3);
        
        assertFalse(tree.contains(10));
        assertFalse(tree.contains(1));
    }
    
    @Test
    void testContainsInEmptyTree() {
        assertFalse(tree.contains(5));
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
        tree.insert(1);
        
        assertTrue(tree.delete(3));
        assertFalse(tree.contains(3));
        assertTrue(tree.contains(1));
        assertEquals(2, tree.size());
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
    void testDeleteRoot() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        
        assertTrue(tree.delete(5));
        assertFalse(tree.contains(5));
        assertEquals(2, tree.size());
    }
    
    @Test
    void testDeleteNonExistentNode() {
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
    void testFindMinimum() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        assertEquals(1, tree.findMin());
    }
    
    @Test
    void testFindMaximum() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        assertEquals(9, tree.findMax());
    }
    
    @Test
    void testFindMinMaxInEmptyTree() {
        assertThrows(IllegalStateException.class, () -> tree.findMin());
        assertThrows(IllegalStateException.class, () -> tree.findMax());
    }
    
    @Test
    void testHeight() {
        assertEquals(-1, tree.height());
        
        tree.insert(5);
        assertEquals(0, tree.height());
        
        tree.insert(3);
        tree.insert(7);
        assertEquals(1, tree.height());
        
        tree.insert(1);
        assertEquals(2, tree.height());
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
    void testNullValueHandling() {
        assertThrows(IllegalArgumentException.class, () -> tree.insert(null));
        assertThrows(IllegalArgumentException.class, () -> tree.contains(null));
        assertThrows(IllegalArgumentException.class, () -> tree.delete(null));
    }
    
    @Test
    void testEdgeCasesWithNegativeNumbers() {
        tree.insert(-5);
        tree.insert(-10);
        tree.insert(-1);
        
        assertTrue(tree.contains(-5));
        assertTrue(tree.contains(-10));
        assertTrue(tree.contains(-1));
        assertEquals(-10, tree.findMin());
        assertEquals(-1, tree.findMax());
    }
}