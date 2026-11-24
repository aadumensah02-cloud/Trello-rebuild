Design Note: Trello Rebuild

1: Overview
This app is a rebuild of Trello, a Kanban board app, a visual organising app that helps people organise tasks into lists and cards on a board. Users can create, edit and drag and drop cards between lists.

This note records the design process and decisions for stage 1-4 including how to manage and order and arrange the lists and cards and the database functionalities. 

2: Data Model:
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

NB: The card does not contain the listIds and the lists do not conatin the boardIds. Order is always stored in the parent array.

*Shape of the state of each of the types

The state for each of the three types (cards, lists, boards) is normalised. This means that the data is treated as if it were a database. Each type gets its own table for storing data. Eachntable stores individual items with ids of the ite 