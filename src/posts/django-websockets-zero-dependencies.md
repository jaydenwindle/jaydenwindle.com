---
title: "Adding Websockets to your Django app with no extra dependencies"
date: 2020-02-04
excerpt: Now that Django 3.0 ships with ASGI support out of the box, adding Websockets to your Django app requires no extra dependencies.
featuredImage: ../images/django-websockets-zero-dependencies.jpg
collection: posts
---

Now that Django 3.0 ships with [ASGI](https://florimond.dev/blog/articles/2019/08/introduction-to-asgi-async-python-web/) support out of the box, adding Websockets to your Django app requires no extra dependencies. In this post, you'll learn how to handle Websockets with Django by extending the default ASGI application. We'll go over how to handle Websocket connections, send and receive data, and implement the business logic in a sample ASGI application.

## Getting started
To start, you'll need Python >= 3.6 installed on your machine. Django 3.0 is only compatible with Python 3.6 and up because it makes use of the `async` and `await` keywords. Once you've got your Python version setup, create a project directory and `cd` into it. Then, install Django inside of a virtualenv and create a new Django app in your project directory:

```bash
$ mkdir django_websockets && cd django_websockets
$ python -m venv venv
$ source venv/bin/activate
$ pip install django
$ django-admin startproject websocket_app .
```

Take a look in the `websocket_app` directory of your Django app. You should see a file called `asgi.py`. Its contents will look something like this:

```python
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'websocket_app.settings')

application = get_asgi_application()
```

This file provides the default Django ASGI setup, and exposes an ASGI application called `application` which can be run using an ASGI server such as `uvicorn` or `daphne`. Before we go much further, let's take a look at how ASGI applications are structured.

## ASGI app structure

[ASGI](https://florimond.dev/blog/articles/2019/08/introduction-to-asgi-async-python-web/), or the Asynchronous Server Gateway Interface, is a specification for building asynchronous web services with Python. It's the spiritual successor to WSGI, which has been used by frameworks like Django and Flask for a long time. ASGI lets you use Python's native `async`/`await` functionality to build web services that support long-lived connections, such as Websockets and Server Sent Events.

An ASGI application is a single `async` function which takes in 3 parameters: `scope` (the context of the current request), `receive` (an `async` function that lets you listen for incoming events), and `send` (an `async` function that lets you send events to the client).

Inside of an ASGI application, you can route requests based on values in the `scope` dictionary. For example, you can check whether the request is an HTTP request or a Websocket request by checking the value of `scope['type']`. To listen for data from the client, you can `await` the `receive` function. When you're ready to send data to the client, you can `await` the `send` function, and pass in any data you want to send to the client. Let's take a look at how this works in a sample application.

## Creating an ASGI app

In our `asgi.py` file, we're going to wrap Django's default ASGI application function with our own ASGI application in order to handle Websocket connections ourselves. To do this, we'll need to define an `async` function called `application`, that takes in the 3 ASGI parameters: `scope`, `receive`, and `send`. Rename the result of the `get_asgi_application` call to `django_application`, because we'll need it process HTTP requests. Inside of our `application` function we'll check the value of `scope['type']` to determine the request type. If the request type is `'http'`, then the request is a normal HTTP request and we should let Django handle it. If the request type is `'websocket'`, then we'll want to handle the logic ourselves. The resulting `asgi.py` file should look something like this:

```python
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'websocket_app.settings')

django_application = get_asgi_application()

async def application(scope, receive, send):
    if scope['type'] == 'http':
        # Let Django handle HTTP requests
        await django_application(scope, receive, send)
    elif scope['type'] == 'websocket':
        # We'll handle Websocket connections here
        pass
    else:
        raise NotImplementedError(f"Unknown scope type {scope['type']}")
```

Now we need to create a function to handle websocket connections. Create a file called `websocket.py` in the same folder as your `asgi.py` file, and define an ASGI application function called `websocket_application` that takes in the 3 ASGI parameters. Next, we'll import `websocket_application` in our `asgi.py` file, and call it inside of our `application` function to handle Websocket requests, passing in the `scope`, `receive`, and `send` parameters. It should look something like this:

```python
# asgi.py
import os

from django.core.asgi import get_asgi_application
from websocket_app.websocket import websocket_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'websocket_app.settings')

django_application = get_asgi_application()

async def application(scope, receive, send):
    if scope['type'] == 'http':
        await django_application(scope, receive, send)
    elif scope['type'] == 'websocket':
        await websocket_application(scope, receive, send)
    else:
        raise NotImplementedError(f"Unknown scope type {scope['type']}")

# websocket.py
async def websocket_application(scope, receive, send):
    pass
```

Next, let's implement some logic for our websocket application. We're going to listen for all websocket connections, and when the client sends the string `"ping"`, we'll respond with the string `"pong!"`. 

Inside of the `websocket_application` funciton, we're going to define an indefinite loop that will handle Websocket requests until the connection is closed. Inside that loop, we'll wait for any new events that the server receives from the client. Then we'll act on the contents of the event, and send the response to the client.

To start, let's handle connections. When a new Websocket client connects to the server, we'll receive a `'websocket.connect'` event. In order to allow this connection, we'll send a `'websocket.accept'` event in response. This will complete the Websocket handshake and establish a persistent connection with the client.

We'll also need to handle disconnection events when a client terminates their connection to the server. To do that, we'll listen for a `'websocket.disconnect'` event. When a client disconnects, we'll break out of our indefinite loop.

Finally, we need to handle requests from the client. To do that, we'll listen for a `'websocket.receive'` event. When we receive a `'websocket.receive'` event from the client, we'll check and see if the value of `event['text']` is `'ping'`. If it is, we'll send a `'websocket.send'` event, with a `text` value of `'pong!'`

After setting up the Websocket logic, our `websocket.py` file should look something like this:

```python
# websocket.py
async def websocket_application(scope, receive, send):
    while True:
        event = await receive()

        if event['type'] == 'websocket.connect':
            await send({
                'type': 'websocket.accept'
            })
        
        if event['type'] == 'websocket.disconnect':
            break
        
        if event['type'] == 'websocket.receive':
            if event['text'] == 'ping':
                await send({
                    'type': 'websocket.send',
                    'text': 'pong!'
                })
```

## Testing it out

Now our ASGI application is set up to handle Websocket connections and we've implemented our Websocket server logic, let's test it out. Right now, the Django development server doesn't use the `asgi.py` file, so you won't be able to test your connections using `./manage.py runserver`. Instead, you'll need to run the app with an ASGI server such as `uvicorn`. Let's install it:

```bash
$ pip install uvicorn
```

Once `uvicorn` is installed, we can run our ASGI application using the following command:

```bash
$ uvicorn websocket_app.asgi:application
INFO:     Started server process [25557]
INFO:     Waiting for application startup.
INFO:     ASGI 'lifespan' protocol appears unsupported.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

To test the Websocket connection, open up your browser's development tools in a new tab. In the console, create a new `Websocket` instance called `ws` pointed to `ws://localhost:8000/`. Then attach an `onmessage` handler to `ws` that logs `event.data` to the console. Finally, call `ws.send('ping')` to send the message to the server. You should see the value `"pong!"` logged to the console.

```javascript
> ws = new WebSocket('ws://localhost:8000/')
  WebSocket {url: "ws://localhost:8000/", readyState: 0, bufferedAmount: 0, onopen: null, onerror: null, …}
> ws.onmessage = event => console.log(event.data)
  event => console.log(event.data)
> ws.send("ping")
  undefined
  pong!
```

Congrats! Now you know how to add Websocket support to your Django application using ASGI. Go build something awesome with it 😎

*👋 Hi, I'm Jayden. I love building apps and teaching others how to build apps. For more posts about building apps with Django, React, and GraphQL, follow me on [Twitter](https://windle.dev/tw) or subscribe to the newsletter below.*