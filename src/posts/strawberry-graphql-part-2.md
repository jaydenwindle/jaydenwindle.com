---
title: "Building GraphQL APIs with Strawberry (Part 2: Mutations)"
date: 2020-01-13
excerpt: In part one of this series, we looked at how to use queries in Strawberry. In this post, we'll...
featuredImage: ../images/strawberry-part-2-devto.jpg
collection: posts
published: false
---

*Note: This post is part 2 in a series of blog posts I'm writing as I work on the official documentation for Strawberry.*

In [the last post](), we looked at how to query data using Strawberry, a modern GraphQL server library for Python. In this post, we'll learn how to use Strawberry to change data on our server using GraphQL Mutations. Let's dive in!

## Hello Mutation

Mutations are used to modify data in GraphQL APIs. You can use them to create, modify, and update data on your server. Let's start with a simple example: 

```python
import strawberry

count = 0

@strawberry.type
class Mutation:
    @strawberry.mutation
    def increment(self, info) -> int:
        global count
        count += 1
        return count

schema = strawberry.Schema(query=Query, mutation=Mutation)
```

In this example, we've got a global variable called `count`. In order to increment that variable from the client side, we'll need to define a GraphQL mutation. We start by defining a base `Mutation` class, much like we defined a base `Query` type in [part 1](). Then we're going to pass it into our `strawberry.Schema`. Finally, we'll define a resolver function called `increment` which increments `count`, and decorate it using the `strawberry.mutation` decorator so that Strawberry knows it's a mutation.

To test out your mutation, start the Strawberry server and visit the GraphQL playground in your browser. You can do that by running the following command:

```bash
$ strawberry server app
Running strawberry on http://0.0.0.0:8000/graphql 🍓
```

If you execute the the `increment` mutation multiple times, you should see the value of count increase each time you run it:

```graphql
mutation {
    increment
}
```

Great job! Let's move on to something a little more useful.

## Creating Todos

somethign something input types...

dict instead of array to make it easier

Let's go back to our todo list example from [part 1](/writing/strawberry-graphql-part-1). If we want to create a new todo item, we'll need to write a mutation. Mutations in strawberry are defined similarly to queries. We'll create a method on our `Mutation` class called `create_todo`, and decorate it with the `strawberry.mutation` decorator so that Strawberry knows that this function is a mutation. Then, inside our `create_todo` methods, we'll create the todo item and store it in our `todos` array.

```python
import strawberry

@strawberry.input
class TodoInputType:
    name: str
    done: typing.Optional[bool]

todos = {
    '1': {
        "id": 1,
        "name": "Finish blog post"
        "done": False
    }
}

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_todo(self, info, todo: TodoInputType) -> TodoType:
        todo = TodoType(
            id=
            name=todo.name,
            done=bool(todo.done)
        )
        todos.append(todo)
        return todo
```

## Updating Todos

```python
import strawberry

@strawberry.type
class TodoInputType:
    name: str
    done: bool

todos = [
  TodoType(name="Todo #1", done=False),
  TodoType(name="Todo #2", done=False),
  TodoType(name="Todo #3", done=True)
]

@strawberry.type
class Mutation:
    @strawberry.mutation
    def update_todo(self, info, id: int, todo: TodoInputType) -> TodoType:
        old_todo = todos[id]
        old_todo.name = todo.name
        old_todo.done = todo.done
        return old_todo
```

## Deleting Todos

```python
import strawberry

@strawberry.type
class TodoInputType:
    name: str
    done: bool

todos = [
  TodoType(name="Todo #1", done=False),
  TodoType(name="Todo #2", done=False),
  TodoType(name="Todo #3", done=True)
]

@strawberry.type
class Mutation:
    @strawberry.mutation
    def delete_todo(self, info, id: int) -> TodoType:
        old_todo = todos[id]
        del todos[id]
        return old_todo
```