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
    @DisplayName("Test insert single node")
    void testInsertSingleNode() {
        tree.insert(5);
        assertTrue(tree.contains(5));
        assertEquals(1, tree.size());
    }
    
    @Test
    @DisplayName("Test insert multiple nodes")
    void testInsertMultipleNodes() {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(1);
        tree.insert(9);
        
        assertTrue(tree.contains(5));
        assertTrue(tree.contains(3));
        assertTrue(tree.contains(7));
        assertTrue(tree.contains(1));
        assertTrue(tree.contains(9));
        assertEquals(5, tree.size());
    }
    
    @Test
    @DisplayName("Test insert duplicate values")
    void testInsertDuplicateValues() {
        tree.insert(5);
        tree.insert(5);
        tree.insert(5);
        
        assertTrue(tree.contains(5));
        assertEquals(1, tree.size());
    }
    
    @Test
    @DisplayName("Test insert negative values")
    void testInsertNegativeValues() {
        tree.insert(-5);
        tree.insert(-10);
        tree.insert(-1);
        
        assertTrue(tree.contains(-5));
        assertTrue(tree.contains(-10));
        assertTrue(tree.contains(-1));
        assertEquals(3, tree.size());
    }
    
    @Test
    @DisplayName("Test insert boundary values")
    void testInsertBoundaryValues() {
        tree.insert(Integer.MAX_VALUE);
        tree.insert(Integer.MIN_VALUE);
        tree.insert(0);
        
        assertTrue(tree.contains(Integer.MAX_VALUE));
        assertTrue(tree.contains(Integer.MIN_VALUE));
        assertTrue(tree.contains(0));
        assertEquals(3, tree.size());
    }
    
    @Test
    @DisplayName("Test contains on empty tree")
    void testContainsOnEmptyTree() {
        assertFalse(tree.contains(5));
        assertFalse(tree.contains(0));
        assertFalse(tree.contains(-1));
    }
    
    @Test
    @DisplayName("Test contains existing values")
    void testContainsExistingValues() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        
        assertTrue(tree.contains(10));
        assertTrue(tree.contains(5));
        assertTrue(tree.contains(15));
    }
    
    @Test
    @DisplayName("Test contains non-existing values")
    void testContainsNonExistingValues() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        
        assertFalse(tree.contains(3));
        assertFalse(tree.contains(12));
        assertFalse(tree.contains(20));
    }
    
    @Test
    @DisplayName("Test delete leaf node")
    void testDeleteLeafNode() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        
        assertTrue(tree.delete(5));
        assertFalse(tree.contains(5));
        assertEquals(2, tree.size());
    }
    
    @Test
    @DisplayName("Test delete node with one child")
    void testDeleteNodeWithOneChild() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        tree.insert(12);
        
        assertTrue(tree.delete(15));
        assertFalse(tree.contains(15));
        assertTrue(tree.contains(12));
        assertEquals(3, tree.size());
    }
    
    @Test
    @DisplayName("Test delete node with two children")
    void testDeleteNodeWithTwoChildren() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        tree.insert(3);
        tree.insert(7);
        tree.insert(12);
        tree.insert(18);
        
        assertTrue(tree.delete(10));
        assertFalse(tree.contains(10));
        assertEquals(6, tree.size());
    }
    
    @Test
    @DisplayName("Test delete root node")
    void testDeleteRootNode() {
        tree.insert(10);
        
        assertTrue(tree.delete(10));
        assertFalse(tree.contains(10));
        assertEquals(0, tree.size());
        assertTrue(tree.isEmpty());
    }
    
    @Test
    @DisplayName("Test delete non-existing node")
    void testDeleteNonExistingNode() {
        tree.insert(10);
        tree.insert(5);
        
        assertFalse(tree.delete(15));
        assertEquals(2, tree.size());
    }
    
    @Test
    @DisplayName("Test delete from empty tree")
    void testDeleteFromEmptyTree() {
        assertFalse(tree.delete(10));
        assertEquals(0, tree.size());
    }
    
    @Test
    @DisplayName("Test size of empty tree")
    void testSizeOfEmptyTree() {
        assertEquals(0, tree.size());
    }
    
    @Test
    @DisplayName("Test size after operations")
    void testSizeAfterOperations() {
        assertEquals(0, tree.size());
        
        tree.insert(10);
        assertEquals(1, tree.size());
        
        tree.insert(5);
        tree.insert(15);
        assertEquals(3, tree.size());
        
        tree.delete(5);
        assertEquals(2, tree.size());
        
        tree.delete(10);
        tree.delete(15);
        assertEquals(0, tree.size());
    }
    
    @Test
    @DisplayName("Test isEmpty on empty tree")
    void testIsEmptyOnEmptyTree() {
        assertTrue(tree.isEmpty());
    }
    
    @Test
    @DisplayName("Test isEmpty on non-empty tree")
    void testIsEmptyOnNonEmptyTree() {
        tree.insert(10);
        assertFalse(tree.isEmpty());
        
        tree.delete(10);
        assertTrue(tree.isEmpty());
    }
    
    @Test
    @DisplayName("Test inorder traversal")
    void testInorderTraversal() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        tree.insert(3);
        tree.insert(7);
        tree.insert(12);
        tree.insert(18);
        
        int[] expected = {3, 5, 7, 10, 12, 15, 18};
        assertArrayEquals(expected, tree.inorderTraversal());
    }
    
    @Test
    @DisplayName("Test inorder traversal on empty tree")
    void testInorderTraversalOnEmptyTree() {
        int[] expected = {};
        assertArrayEquals(expected, tree.inorderTraversal());
    }
    
    @Test
    @DisplayName("Test preorder traversal")
    void testPreorderTraversal() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        tree.insert(3);
        tree.insert(7);
        
        int[] expected = {10, 5, 3, 7, 15};
        assertArrayEquals(expected, tree.preorderTraversal());
    }
    
    @Test
    @DisplayName("Test postorder traversal")
    void testPostorderTraversal() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        tree.insert(3);
        tree.insert(7);
        
        int[] expected = {3, 7, 5, 15, 10};
        assertArrayEquals(expected, tree.postorderTraversal());
    }
    
    @Test
    @DisplayName("Test height of empty tree")
    void testHeightOfEmptyTree() {
        assertEquals(-1, tree.height());
    }
    
    @Test
    @DisplayName("Test height of single node tree")
    void testHeightOfSingleNodeTree() {
        tree.insert(10);
        assertEquals(0, tree.height());
    }
    
    @Test
    @DisplayName("Test height of balanced tree")
    void testHeightOfBalancedTree() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        tree.insert(3);
        tree.insert(7);
        tree.insert(12);
        tree.insert(18);
        
        assertEquals(2, tree.height());
    }
    
    @Test
    @DisplayName("Test height of unbalanced tree")
    void testHeightOfUnbalancedTree() {
        tree.insert(1);
        tree.insert(2);
        tree.insert(3);
        tree.insert(4);
        tree.insert(5);
        
        assertEquals(4, tree.height());
    }
    
    @Test
    @DisplayName("Test find minimum in empty tree")
    void testFindMinimumInEmptyTree() {
        assertThrows(IllegalStateException.class, () -> tree.findMin());
    }
    
    @Test
    @DisplayName("Test find minimum")
    void testFindMinimum() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        tree.insert(3);
        tree.insert(7);
        
        assertEquals(3, tree.findMin());
    }
    
    @Test
    @DisplayName("Test find maximum in empty tree")
    void testFindMaximumInEmptyTree() {
        assertThrows(IllegalStateException.class, () -> tree.findMax());
    }
    
    @Test
    @DisplayName("Test find maximum")
    void testFindMaximum() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        tree.insert(3);
        tree.insert(18);
        
        assertEquals(18, tree.findMax());
    }
    
    @Test
    @DisplayName("Test clear tree")
    void testClearTree() {
        tree.insert(10);
        tree.insert(5);
        tree.insert(15);
        
        assertFalse(tree.isEmpty());
        assertEquals(3, tree.size());
        
        tree.clear();
        
        assertTrue(tree.isEmpty());
        assertEquals(0, tree.size());
        assertFalse(tree.contains(10));
    }
    
    @Test
    @DisplayName("Test clear empty tree")
    void testClearEmptyTree() {
        tree.clear();
        assertTrue(tree.isEmpty());
        assertEquals(0, tree.size());
    }
}