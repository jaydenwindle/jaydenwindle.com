---
title: "Building GraphQL APIs with Strawberry Part 1: Queries"
date: 2019-09-22
excerpt: Strawberry is a modern GraphQL server library for Python that's simple to understand and quick to ...
featuredImage: ../images/strawberry.jpg
collection: posts
---

*Note: This post is part 1 in a series of blog posts I'm writing as I work on the official documentation for Strawberry.*

Strawberry is a modern GraphQL server library for Python that's simple to understand and quick to get started with. In this series we're going to learn how to use Strawberry to build a fully-featured GraphQL API.


If this is your first time working with GraphQL, I'd recommend reading through the first 4 lessons of the [GraphQL Fundamentals](https://www.howtographql.com/basics/0-introduction/) course to learn about the basic concepts before continuing.

Without further ado, let's dive in!

## Environment Setup
To start, we're going to set up our development environment. Because Strawberry uses some newer python features (like dataclasses and type hints), you'll need to make sure you're running python 3.7 or above. You can check which version of python you have installed by running `$ python --version`. If you don't have python >=3.7 installed on your machine, you'll need to set that up. I recommend using `pyenv` for this.

Once you've got python 3.7 installed, you'll need to set up a virtual environment and install strawberry.

```bash
$ python --version
Python 3.7.4

$ python -m venv venv
$ source venv/bin/activate
$ pip install strawberry-graphql
```

Nice! You're ready to get started.

## Hello World!
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

Open up your browser to http://localhost:8000/graphql, and you can test your query in the GraphQL Playground. Try running your query by typing this in the right pane, and clicking `Run`:

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

Congrats! You've written your first GraphQL resolver with Strawberry!

## Custom Types

Now we're going to try a more interesting example. Let's say we want to build a todo list app. We'll need store a list of tasks with their statuses (done or not done). In order to query this data, we'll need to be able to return a custom type that represents a todo object. We'll do this by defining a custom GraphQL type. Using Strawberry, we can define a custom GraphQL type like so:

```python
@strawberry.type
class TodoType:
    name: str
    done: bool
```

Here we're creating a type using the `strawberry.type` decorator, with a `str` attribute called `name` and a `bool` attribute called `done`. This will define a GraphQL type with the following SDL:

```graphql
type TodoType {
  name: String!
  age: Boolean!
}
```

Now, let's use it in a query. We'll define a query and a resolver function just like we did last time, only this time we'll call the function `todos`, give it a return type of `List[TodoType]`, and have it return our array of todos. It should look something like this:

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

Awesome! We've created a custom type and a custom resolver that returns that type.

## Resolver Arguments

Another important feature of any todo app is being able to filter your todos by their status. In order to do that, we'd need to pass in extra parameters to our GraphQL query. With strawberry, you can add an parameter to any resolver definition by adding a typed input argument to the resolver function. If you provide a default value for the input argument, the parameter will be optional in your GraphQL schema.

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

If we run our query again with a `done` parameter, we should be see the results. Running this query:

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

There you go! You've now got a working GraphQL API set up using strawberry. This is only scratching the surface of what strawberry can do. If you want to learn more, check out strawberry on [Github](https://github.com/strawberry-graphql/strawberry).