---
title: "Building GraphQL APIs with Python and Strawberry (Part 1: Queries)"
date: 2019-09-22
excerpt: Strawberry is a GraphQL server library for python that's based on Python 3's dataclasses. It's designed...
featuredImage: ../images/strawberry.jpg
collection: posts
---

Strawberry is a GraphQL server library for python that's based on Python 3's dataclasses. It's designed to help you build GraphQL APIs quickly and easily. In this post we're going to build a GraphQL API together using strawberry.


If this is your first time working with GraphQL, I'd recommend reading through the first 4 lessons of the [GraphQL Fundamentals](https://www.howtographql.com/basics/0-introduction/) course to learn about the basics of GraphQL.


## Environment Setup
To start, let's set up our development environment. Because strawberry uses some newer python features (like dataclasses and type hints), you'll need to make sure you're running python 3.7 or above. You can check which version of python you have installed by running `$ python --version`. If you don't have python >=3.7 installed on your machine, you'll need to set that up. I recommend using `pyenv` for this.

Once you've got python 3.7 installed, you'll need to set up a virtual environment and install strawberry.

```bash
$ python --version
Python 3.7.4

$ python -m venv venv
$ source venv/bin/activate
$ pip install strawberry-graphql
```

Nice! You're ready to get started.

## Hello World Query
Let's create a file called `app.py` and wire up a basic strawberry app:

```python
import strawberry

@strawberry.type
class Query:
    @strawberry.field
    def hello(self, info) -> str:
        return "world"

schema = strawberry.Schema(query=Query)
```

We start by defining a `Query` type. We use the `strawberry.type` decorator to mark this class as a GraphQL type. Then, we define a resolver function using the `strawberry.field` decorator. Resolver functions take in two positional arguments (`self` and `info`), and must specify a return type. In this case, we're defining a resolver function called `hello`, which returns the string `"world"`.

In order to run our query, we need to expose it via a schema. To do this, we pass in our `Query` class as an argument to `strawberry.schema`.

Strawberry comes with a built in server to help you get up and running quickly. To start it using your `app.py` file, run:

```bash
$ strawberry server app

Running strawberry on http://0.0.0.0:8000/graphql 🍓
```

Open up your browser to http://localhost:8000/graphql, and you can test your query in the GraphQL Playground. Try running this query:

```graphql
query {
    hello
}
```

You should receive a response that looks like:

```json
{
  "data": {
    "hello": "world"
  }
}
```

Congrats! You've written your first strawberry resolver using system types.

## Custom Types

Let's try a more complicated example. Let's say we want to build a todo list app. We'll need to be able to return data that's not a python system type. To do this, we'll need to define a custom GraphQL type. Using strawberry, we can define a custom GraphQL type like so:

```python
@strawberry.type
class TodoType:
    name: str
    done: bool
```

This will define a GraphQL type with the following SDL:

```graphql
type TodoType {
  name: String!
  age: Boolean!
}
```

Now, let's use it in a query. For now we'll store our list of todos in a python list. We'll define a query and a resolver function just like we did last time, only this time we'll call the function `todos`, give it a return type of `List[TodoType]`, and have it return our array of todos. It should look something like this:

```python
from typing import List

todos = [
  TodoType(name="Todo #1", done=False),
  TodoType(name="Todo #2", done=False),
  TodoType(name="Todo #3", done=True)
]

@strawberry.type
class Query:
    @strawberry.field
    def todos(self, info) -> List[TodoType]:
        return todos
```

Let's test this out in the GraphQL Playground. If we run this query:

```graphql
query {
  todos {
    name
    done
  }
}
```

we should get the following response:

```json
{
  "data": {
    "todos": [
      {
        "name": "Todo #1",
        "done": false
      },
      {
        "name": "Todo #2",
        "done": false
      },
      {
        "name": "Todo #3",
        "done": true
      }
    ]
  }
}
```

Awesome! We've created a custom type and a custom resolver for that type.

## Resolver Arguments

What if we wanted to filter todos by their completion status? We'd need to be able to pass in extra parameters to our GraphQL query. To accomplish this with strawberry, you need to add an argument to the resolver definition and specify the type. 

In our case, we want to be able to filter our todos by their `done` value, so we'll add an argument called `done` of the type `bool`. We'll also add some logic to the resolver to filter the todos in our array:

```python
@strawberry.type
class Query:
    @strawberry.field
    def todos(self, info, done: bool = None) -> List[TodoType]:
        if done is not None:
            return filter(lambda todo: todo.done, todos)
        else:
            return todos
```

If we run our query again with a `done` parameter, we should be see the results. This query:

```graphql
query {
  todos(done: true) {
    name
    done
  }
}
```

will return:

```json
{
  "data": {
    "todos": [
      {
        "name": "Todo #3",
        "done": true
      }
    ]
  }
}
```

There you go! You've now got a GraphQL API with several queries set up using strawberry. This is only scratching the surface of what strawberry can do. If you want to learn more, check out strawberry on [Github](https://github.com/strawberry-graphql/strawberry).