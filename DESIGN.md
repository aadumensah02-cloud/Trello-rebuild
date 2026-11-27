Design Note: Trello Rebuild

**STAGE 1:

1. Overview
This app is a rebuild of Trello, a Kanban board app, a visual organizing app that helps people organize tasks into lists and cards on a board. Users can create, edit and drag and drop cards between lists.

This note records the design process and decisions for stage 1-4 including how to manage and order and arrange the lists and cards and the database functionalities. 

2. Data Model:
Types:

A Card:
-id: A string, which can be generated offline using (crypto.randomUUID). The id id used to separate one card from another and is used for identification.

-title: A string, it is used to identify what the card is about. The card is meaningless without one.

-description: A string, (optional text), used to describe what the card is about.


A list:
-id: string, to separate one list from another.

-title: string, to give information about what the list is about.

-cardIds: an array of card ids, in order.This contains the order of arrangement of the cards and can help in dragging or dropping.


A board:
-id: a string

-title: a string

-listIds; an array of list ids, in order. This contains the order of arrangement of the lists.

*Typescript:
//
export type Board = {
    id: string;
    title: string;
    listIds: string[];
}

export type List = {
    id: string;
    title: string;
    cardIds: string[];
}

export type Card = {
    id: string;
    title: string;
    description?: string;
}

export type State = {
    boards: Record<string, Board>;
    lists: Record<string, List>;
    cards: Record<string, Card>;
}
//


*Shape of the state of each of the types

The state for each of the three types (cards, lists, boards) is normalized. This means that the data is treated as if it were a database. Each type gets its own table for storing data. Each table stores individual items with ids of the items as keys which are used for referencing the items. The ids of each item are stored in an array and is used to indicate ordering.

NB: The card does not contain the listIds and the lists do not contain the boardIds. Order is always stored in the parent array.

-Why I chose this:
* It makes moving cards between lists easier because it only changes the cardIds arrays of the two lists involved. The board and card are not affected.

* Each piece of data is stored once and it makes editing easier since editing it it original collection affects it in the whole code.

* It makes finding information easier due to the use of Ids.

-What it costs:
* Deleting needs extra work because deleting a list means you'll also have to decide whether to move or delete the cards that were in the list, because they would otherwise stay in cards collection with nothing pointing at them. 

* A missing id is a possible bug. because a list's cardIds can contain an id that has no matching card. Both are valid strings, so typescript won't detect it as an error when it does not match. A test will be needed to check this cost.

* Rendering needs a lookup step because parent collections only store the ids of the child collections. So to look for a child collection, a parent collection takes each id and looks for it in the child collection.


3. Card Ordering:
My choice: An array of Ids in each list.

-Why i chose it:
* Moving cards is easier since you just need to move the id from the original position to the desired position.

* Unlike in position number,where you have to think about fractional indexing, arrays allows you to insert the ids at any index.

* It makes dragging and dropping of cards easier since you get an index when you drag and drop and you do not need to decide the fractional indexing like in position numbers.

* It solves the rebalancing problem in position numbers since an array has no position number and there's nothing to run out of precision of.

-What it costs:
*Arrays don't map well onto SQL rows because a table has no built in order. I will have to figure out a way to fix this issue as we go on.

* An array can contain mistakes that typescript can't catch since the ids are stored as strings.

* Because moving a card from one list to another changes two arrays, we have to find a way to save the two records so that one is not lost.

Test Cases:
Case 1: move to the end of a list
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
          ListHeader
          Card
          AddCardForm
        AddListForm

* Component Note: 
App:
Imports the sample data used and hands the board to the board component. It is not repeated. It has no props

Board:
Renders and lays out one list per id using board.listIds. Displays a board title and lists and its card in order. It has a board prop and its is not repeated.

List:
Renders the list.cardIds into cards in order. It is repeated once per column. It has a list props.

ListHeader:
Shows a list title and number of cards in a list and can be renamed and deleted. It has title and cardCount prop.

Card:
Shows one card's title and is repeated multiple times for every card. It can be edited, deleted and dragged between different lists. It has a card prop.

AddCardForm:
It is a placeholder for the "add a card" area. It is an area to add new cards and is repeated once. It has no props.

AddListForm:
It is a placeholder for the "add a list" area. It is an area to add new lists and is repeated once. It has no props.


