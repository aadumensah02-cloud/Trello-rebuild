Design Note: Trello Rebuild

1. Overview
This app is a rebuild of Trello, a Kanban board app, a visual organising app that helps people organise tasks into lists and cards on a board. Users can create, edit and drag and drop cards between lists.

This note records the design process and decisions for stage 1-4 including how to manage and order and arrange the lists and cards and the database functionalities. 

2. Data Model:
Types:

A Card:
-id: A string, which can be generated offline using (crypto.randomUUID). The id id used to seperate one card from another and is used for identification.

-title: A string, it is used to identify what the card is about. The card is meaningless without one.

-description: A string, (optional text), used to describe what the card is about.

-Optional additions:
due dates, labels, edit card buttons,comments

A list:
-id: string, to seperate one list from another.

-title: string, to give information about what the list is about.

-cardIds: an array of card ids, in order.This contains the order of arrangement of the cards and can help in dragging or dropping.

-Optional additions: 
total number of cards, add a card button, close list buuton

A board:
-id: a string

-title: a string

-listIds; an array of list ids, in order. This contains the order of arrangement of the lists.


*Shape of the state of each of the types

The state for each of the three types (cards, lists, boards) is normalised. This means that the data is treated as if it were a database. Each type gets its own table for storing data. Each table stores individual items with ids of the items as keys which are used for referencing the items. The ids of each item are stored in an array and is used to indicate ordering.

NB: The card does not contain the listIds and the lists do not conatin the boardIds. Order is always stored in the parent array.

-Why I chose this:
* It makes moving cards between lists easier without touching other sections of the code.

* Each piece of data is stored once and it makes editing easier since editing it it original collection affects it in the whole code.

* It makes finding information easier due to the use of Ids.

-What it costs:
* Deteting needs extra work because you'll also have to remove the ids of the items you have deleted in other collections of items.

* A missing id is a possible bug because the ids are a string, tpescript won't detect it as an error when it is empty.

* Rendering needs a looku step because parent collections only store the ids of the child collections. So to look for a child collection, a parent collection takes each id and looks for it in the child collection.


3. Card Ordering:
My choice: An array of Ids in each list.

-Why i chose it:
* Moving cards is easier since you just need to move the id from the original position to the desired position.

* Unlike in positon number,where you have to think about fractional indexing, arrays allows you to insert the ids at any index.

* It makes dragging and dropping of cards easier since you get an index when you drag and drop and you do not need to decide the fractional indexing like in position numbers.

* It solves the rebalancing problem in position numbers since you do not need to run out of floating-point precisions for each item.

-What it costs:
*Arrays don't work well in SQL tables because it doesn't map onto SQL tables.

* An array can contain mistakes that typescript can't catch since the ids are stored as strings.

* Becausing moving a card from one list to another two arrays, we have to find a way to the two records so that one is not lost.

Test Cases:
Case 1: move to the end of a different list
Before: list1.CardIds = [c1, c2,c3] , list2.cardIds = [ c4] 
Action: move c1 to the end of the list 1 array
After: list1.cardIds = [ c2, c3, c1] , list2.cardIds = [ c4]
What changed: the index of c1 changed from 0 to 2. the change only affected one array.

Case 2: move to the middle of a different list
Before: list1.CardIds = [c1, c3] , list2.cardIds = [ c4] 
Action: move c4 to the middle of the list 1 array
After: list1.cardIds = [ c1, c4, c3] , list2.cardIds = []
What changed: c4 moved from one array to the other. the index became 1 in the new array and the old array has nothing it it.

Case 3: move into an empty array list
Before: list1.CardIds = [c1, c2, c3] , list2.cardIds = [] 
Action: move c1 to the list2.cardsId array
After: list1.cardIds = [ c2, c3] , list2.cardIds = [ c1 ]
What changed: c1 moved from one array to the other. the index became 0 in the new array.

4. Component tree:
App
   Board
       List
          ListHeader (tells the parent when the title is renamed or the list is deleted)
                Card
                   AddCardForm (is used when a new card is submitted)
                        AddListForm (is used when a new list is submitted)

* Component Note: 
App:
imports the sample data used and hands the board to the board component. It is not repeated. It has no props

Board:
Renders and lays out one list per id using board.listIds. Displays a board title and lists and its card in order. It has a list prop and its is not repeated.

List:
Renders the list.cardIds into cards in order. It is repeated once per column. It has a list props.

ListHeader:
showsa list title and number of cards in a list and can be renamed and deleted. It has a title prop and a cardCount prop.

Card:
Shows one card's title and is repeated multiple times for every card. It can be edited, deleted and dragged between different lists. It has a card prop.

AddCardForm:
It is a placeholder for the add a card area. It is an area to add new cards and is repeated once. It has no props.

AddListForm:
It is a placeholder for the add a list area. It is an area to add new lists and is repeated once. It has no props.


