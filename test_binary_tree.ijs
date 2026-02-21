NB. Comprehensive Unit Tests for Binary Tree Implementation
NB. Test framework setup
cocurrent 'test'

NB. Mock Binary Tree Implementation for Testing
NB. Node structure: value;left_child;right_child
NB. Empty tree represented as ''

NB. Helper functions
create_node =: 3 : 'y;'';'''
get_value =: 0&{::
get_left =: 1&{::
get_right =: 2&{::
set_left =: 4 : '(<x) (<1) } y'
set_right =: 4 : '(<x) (<2) } y'

NB. Binary Tree Operations
insert =: 4 : 0
  if. '' -: y do. create_node x return. end.
  val =. get_value y
  if. x < val do.
    left =. get_left y
    new_left =. x insert left
    new_left set_left y
  else.
    right =. get_right y
    new_right =. x insert right
    new_right set_right y
  end.
)

search =: 4 : 0
  if. '' -: y do. 0 return. end.
  val =. get_value y
  if. x = val do. 1 return. end.
  if. x < val do.
    x search get_left y
  else.
    x search get_right y
  end.
)

preorder_traversal =: 3 : 0
  if. '' -: y do. '' return. end.
  val =. get_value y
  left_vals =. preorder_traversal get_left y
  right_vals =. preorder_traversal get_right y
  val , left_vals , right_vals
)

inorder_traversal =: 3 : 0
  if. '' -: y do. '' return. end.
  left_vals =. inorder_traversal get_left y
  val =. get_value y
  right_vals =. inorder_traversal get_right y
  left_vals , val , right_vals
)

postorder_traversal =: 3 : 0
  if. '' -: y do. '' return. end.
  left_vals =. postorder_traversal get_left y
  right_vals =. postorder_traversal get_right y
  val =. get_value y
  left_vals , right_vals , val
)

min_value =: 3 : 0
  if. '' -: y do. _. return. end.
  left =. get_left y
  if. '' -: left do.
    get_value y
  else.
    min_value left
  end.
)

max_value =: 3 : 0
  if. '' -: y do. __. return. end.
  right =. get_right y
  if. '' -: right do.
    get_value y
  else.
    max_value right
  end.
)

delete_node =: 4 : 0
  if. '' -: y do. '' return. end.
  val =. get_value y
  if. x < val do.
    new_left =. x delete_node get_left y
    new_left set_left y
  elseif. x > val do.
    new_right =. x delete_node get_right y
    new_right set_right y
  else.
    left =. get_left y
    right =. get_right y
    if. '' -: left do. right return. end.
    if. '' -: right do. left return. end.
    min_val =. min_value right
    new_right =. min_val delete_node right
    min_val;left;new_right
  end.
)

clear_tree =: 3 : ''''

is_valid =: 3 : 0
  is_valid_helper =: 4 : 0
    'min_val max_val' =. x
    if. '' -: y do. 1 return. end.
    val =. get_value y
    if. -. (min_val < val) *. (val < max_val) do. 0 return. end.
    left_valid =. (min_val,val) is_valid_helper get_left y
    right_valid =. (val,max_val) is_valid_helper get_right y
    left_valid *. right_valid
  )
  (__,_) is_valid_helper y
)

NB. Test Cases

NB. Test 1: Empty tree construction
test_empty_tree =: 3 : 0
  tree =. ''
  assert '' -: tree
  assert 0 = 5 search tree
  assert '' -: preorder_traversal tree
  assert '' -: inorder_traversal tree
  assert '' -: postorder_traversal tree
  assert _. = min_value tree
  assert __. = max_value tree
  assert 1 = is_valid tree
  'PASS: Empty tree tests'
)

NB. Test 2: Single node tree
test_single_node =: 3 : 0
  tree =. create_node 10
  assert 1 = 10 search tree
  assert 0 = 5 search tree
  assert 10 -: preorder_traversal tree
  assert 10 -: inorder_traversal tree
  assert 10 -: postorder_traversal tree
  assert 10 = min_value tree
  assert 10 = max_value tree
  assert 1 = is_valid tree
  'PASS: Single node tests'
)

NB. Test 3: Insert operations
test_insert =: 3 : 0
  tree =. ''
  tree =. 10 insert tree
  tree =. 5 insert tree
  tree =. 15 insert tree
  tree =. 3 insert tree
  tree =. 7 insert tree
  tree =. 12 insert tree
  tree =. 18 insert tree
  
  assert 1 = 10 search tree
  assert 1 = 5 search tree
  assert 1 = 15 search tree
  assert 1 = 3 search tree
  assert 1 = 7 search tree
  assert 1 = 12 search tree
  assert 1 = 18 search tree
  assert 0 = 20 search tree
  'PASS: Insert tests'
)

NB. Test 4: Traversal methods
test_traversals =: 3 : 0
  tree =. ''
  tree =. 10 insert tree
  tree =. 5 insert tree
  tree =. 15 insert tree
  tree =. 3 insert tree
  tree =. 7 insert tree
  
  preorder =. preorder_traversal tree
  inorder =. inorder_traversal tree
  postorder =. postorder_traversal tree
  
  assert 10 5 3 7 15 -: preorder
  assert 3 5 7 10 15 -: inorder
  assert 3 7 5 15 10 -: postorder
  'PASS: Traversal tests'
)

NB. Test 5: Min and Max values
test_min_max =: 3 : 0
  tree =. ''
  tree =. 10 insert tree
  tree =. 5 insert tree
  tree =. 15 insert tree
  tree =. 3 insert tree
  tree =. 18 insert tree
  
  assert 3 = min_value tree
  assert 18 = max_value tree
  'PASS: Min/Max tests'
)

NB. Test 6: Delete operations
test_delete =: 3 : 0
  tree =. ''
  tree =. 10 insert tree
  tree =. 5 insert tree
  tree =. 15 insert tree
  tree =. 3 insert tree
  tree =. 7 insert tree
  tree =. 12 insert tree
  tree =. 18 insert tree
  
  NB. Delete leaf node
  tree =. 3 delete_node tree
  assert 0 = 3 search tree
  assert 1 = 5 search tree
  
  NB. Delete node with one child
  tree =. 15 delete_node tree
  assert 0 = 15 search tree
  assert 1 = 12 search tree
  assert 1 = 18 search tree
  
  NB. Delete root node
  tree =. 10 delete_node tree
  assert 0 = 10 search tree
  assert 1 = 5 search tree
  assert 1 = 7 search tree
  'PASS: Delete tests'
)

NB. Test 7: Clear tree
test_clear =: 3 : 0
  tree =. ''
  tree =. 10 insert tree
  tree =. 5 insert tree
  tree =. 15 insert tree
  
  tree =. clear_tree tree
  assert '' -: tree
  assert 0 = 10 search tree
  'PASS: Clear tree tests'
)

NB. Test 8: Tree validation
test_validation =: 3 : 0
  NB. Valid tree
  tree =. ''
  tree =. 10 insert tree
  tree =. 5 insert tree
  tree =. 15 insert tree
  assert 1 = is_valid tree
  
  NB. Invalid tree (manually constructed)
  invalid_tree =. 10;(15;'';'');(5;'';'')
  assert 0 = is_valid invalid_tree
  'PASS: Validation tests'
)

NB. Test 9: Complex tree operations
test_complex_operations =: 3 : 0
  tree =. ''
  values =. 50 30 70 20 40 60 80 10 25 35 45
  for_val. values do.
    tree =. val insert tree
  end.
  
  assert 1 = is_valid tree
  assert 10 = min_value tree
  assert 80 = max_value tree
  
  inorder =. inorder_traversal tree
  expected =. 10 20 25 30 35 40 45 50 60 70 80
  assert expected -: inorder
  
  NB. Delete various nodes
  tree =. 20 delete_node tree
  tree =. 30 delete_node tree
  tree =. 50 delete_node tree
  
  assert 1 = is_valid tree
  assert 0 = 20 search tree
  assert 0 = 30 search tree
  assert 0 = 50 search tree
  'PASS: Complex operations tests'
)

NB. Test 10: Edge cases
test_edge_cases =: 3 : 0
  NB. Insert duplicate values
  tree =. ''
  tree =. 10 insert tree
  tree =. 10 insert tree
  tree =. 10 insert tree
  
  NB. Should handle duplicates by going right
  assert 1 = 10 search tree
  
  NB. Delete from empty tree
  empty_tree =. ''
  result =. 5 delete_node empty_tree
  assert '' -: result
  
  NB. Search in deeply nested tree
  deep_tree =. ''
  for_i. i.20 do.
    deep_tree =. i insert deep_tree
  end.
  assert 1 = 10 search deep_tree
  assert 0 = 25 search deep_tree
  'PASS: Edge cases tests'
)

NB. Run all tests
run_all_tests =: 3 : 0
  tests =. test_empty_tree;test_single_node;test_insert;test_traversals;test_min_max;test_delete;test_clear;test_validation;test_complex_operations;test_edge_cases
  results =. ''
  for_test. tests do.
    try.
      result =. test ''
      results =. results , result , LF
    catch.
      results =. results , 'FAIL: ' , (5!:5 <'test') , ' - ' , (13!:12 '') , LF
    end.
  end.
  results
)

NB. Execute tests
run_all_tests ''