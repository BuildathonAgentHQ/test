import java.util.LinkedList;
import java.util.Queue;

public class BinaryTree {

    static class Node {
        int data;
        Node left, right;

        Node(int data) {
            this.data = data;
            left = right = null;
        }
    }

    Node root;

    // Insert nodes level-by-level (BFS order)
    void insert(int data) {
        Node newNode = new Node(data);
        if (root == null) {
            root = newNode;
            return;
        }
        Queue<Node> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            Node current = queue.poll();
            if (current.left == null) {
                current.left = newNode;
                return;
            } else {
                queue.add(current.left);
            }
            if (current.right == null) {
                current.right = newNode;
                return;
            } else {
                queue.add(current.right);
            }
        }
    }

    // Print tree visually (rotated 90° — right subtree on top)
    void printTree(Node node, String prefix, boolean isLeft) {
        if (node == null) return;
        printTree(node.right, prefix + (isLeft ? "│   " : "    "), false);
        System.out.println(prefix + (isLeft ? "└── " : "┌── ") + node.data);
        printTree(node.left, prefix + (isLeft ? "    " : "│   "), true);
    }

    // In-order traversal: Left → Root → Right
    void inOrder(Node node) {
        if (node == null) return;
        inOrder(node.left);
        System.out.print(node.data + " ");
        inOrder(node.right);
    }

    // Pre-order traversal: Root → Left → Right
    void preOrder(Node node) {
        if (node == null) return;
        System.out.print(node.data + " ");
        preOrder(node.left);
        preOrder(node.right);
    }

    // Post-order traversal: Left → Right → Root
    void postOrder(Node node) {
        if (node == null) return;
        postOrder(node.left);
        postOrder(node.right);
        System.out.print(node.data + " ");
    }

    // Level-order (BFS) traversal
    void levelOrder() {
        if (root == null) return;
        Queue<Node> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            Node current = queue.poll();
            System.out.print(current.data + " ");
            if (current.left != null)  queue.add(current.left);
            if (current.right != null) queue.add(current.right);
        }
    }

    public static void main(String[] args) {
        BinaryTree tree = new BinaryTree();

        // Insert values: 1..7
        int[] values = {1, 2, 3, 4, 5, 6, 7};
        for (int v : values) tree.insert(v);

        System.out.println("=== Binary Tree Structure ===");
        System.out.println("(read left-to-right as bottom-to-top of the tree)\n");
        tree.printTree(tree.root, "", true);

        System.out.println("\n=== Traversals ===");
        System.out.print("In-order   (L→Root→R): ");
        tree.inOrder(tree.root);

        System.out.print("\nPre-order  (Root→L→R): ");
        tree.preOrder(tree.root);

        System.out.print("\nPost-order (L→R→Root): ");
        tree.postOrder(tree.root);

        System.out.print("\nLevel-order (BFS)    : ");
        tree.levelOrder();
        System.out.println();
    }
}
