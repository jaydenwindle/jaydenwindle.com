---
title: "Adding Websockets to your Django app with zero dependencies"
date: 2020-02-04
excerpt: Now that Django 3.0 ships with ASGI support out of the box, adding Websockets to your Django app is simple and requires no extra dependencies.
featuredImage: ../images/django-websockets-zero-dependencies.jpg
collection: posts
---

Now that Django 3.0 ships with ASGI support out of the box, adding Websockets to your Django app is simple and requires no extra dependencies. In this post, you'll learn how to set up Websockets in Django using a custom ASGI application, and how to send and receive data to your Websocket clients.

## Getting started
To start, you'll need Python >= 3.6 installed on your machine. Django 3.0 is only compatible with Python 3.6 and greater because it makes use of the `async` and `await` keywords. Once you've got your Python version setup, create a project directory and `cd` into it. Then, install Django inside of a virtualenv and create a new Django app in your project directory. I'm going to use `pipenv` to do this:

```bash
$ mkdir django_websockets && cd django_websockets
$ pipenv install django
$ pipenv run django-admin startproject websocket_app .
```

Take a look in the `websocket_app` directory of your Django app. You should find a file called `asgi.py`. It's contents should look something like this:

```python
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'websocket_app.settings')

application = get_asgi_application()
```

## ASGI app structure

Before you go any further, lets look at the structure of an ASGI application. An ASGI app is simply an `async` function which takes in 3 parameters: `scope` (the context of the current request), `receive` (an `async` function that lets you listen for incoming events), and `send` (an `async` function that lets you send events to the client).

Inside of the ASGI function, you can route requests based on the values in `scope`. For example, you can check whether the request is an HTTP request or a Websocket request by checking the `scope['type']` attribute. You can also `await` the receive function to listen for new data from the client. Then, when you're ready to send data to the client, you can `await` the `send` function, and pass in any data you want to send to the client. Let's look at how this works in our application.

## Creating an ASGI app

In our `asgi.py` file, we can wrap the default Django ASGI application in our own ASGI application, and handle some of the logic ourselves. To do this, we'll need to define an `async` function called `application`, that takes in the 3 ASGI parameters: `scope`, `receive`, and `send`. Rename the result of the `get_asgi_application` call to `django_application`, because we'll need it later. Inside our `application` function we'll check the value of `scope['type']`. If `scope['type'] == 'http'`, then that means that the current ASGI request is a normal HTTP request and we should let Django handle it. If `scope['type'] == 'websocket'`, then we'll want to handle the application ourselves. When you're done, `asgi.py` should look something like this:

```python
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'websocket_app.settings')

django_application = get_asgi_application()

async def application(scope, receive, send):
    if scope['type'] == 'http':
        await django_application(scope, receive, send)
    elif scope['type'] == 'websocket':
        # We'll handle websocket connections here
        pass
    else:
        raise NotImplementedError(f"Unknown scope type {scope['type']}")
```

Now we need to create a handler for websocket connections. Create a file called `websocket.py` in the same folder as your `asgi.py` folder, and define an ASGI application function called `websocket_application` that takes in the 3 ASGI parameters. Next, we'll import `websocket_application` in our `asgi.py` file, and call it inside of our application function, passing in the `scope`, `receive`, and `send` parameters. When you're done, it should look something like this:

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
async def websocket_appliation(scope, receive, send):
    pass
```

Next, lets implement some simple logic for our websocket application. We're going to listen for all websocket connections, and when the client send the string `"ping"`, we'll respond with the string `"pong!"`. Inside of our `websocket_application`, we're going to define an indefinite loop. Inside that loop, we'll wait for any new events that the server receives from the client. Then we'll act on the content of the event.

To start, lets handle connections. When a new websocket client connects to the server, we'll receive an `event` where `event['type'] == 'websocket.connect'`. In order to allow this connection, we'll send and event where `event['type'] == 'websocket.accept'`. This will complete the websocket handshake and initialize the websocket connection.

We'll also need to handle disconnection events when a client terminates their connection with the server. To do that, we'll listen for an `event` where `event.['type'] == 'websocket.disconnect'`. When a client disconnects, we'll break out of our indefinite loop.

Finally, we need to handle requests from the client. To do that, we'll listen for an  `event` where `event['type'] == 'websocket.receive'`. When we receive the event, we'll check and see if `event['text']` is equal to the value `"ping"`. If it is, we'll send an `event` with `event['type']` set to `'websocket.send'`, and `event['text']` equal to `'pong!'`

When you've got that set up, it should look something like this:

```python
# websocket.py
async def websocket_appliation(scope, receive, send):
    while True:
        message = await receive()

        if message['type'] == 'websocket.connect':
            await send({
                'type': 'websocket.accept'
            })
        
        if message['type'] == 'websocket.disconnect':
            break
        
        if message['type'] == 'websocket.receive':
            if message['text'] == 'ping':
                await send({
                    'type': 'websocket.send',
                    'text': 'pong!'
                })
```

## Testing it out

Now that we've got our ASGI application set up to handle Websocket connections and we've implemented our Websocket server logic, lets test it out. Right now, the Django development server doesn't use the `asgi.py` file, so you won't be able to test your connections using `./manage.py runserver`. Instead, you'll need to run the app with an ASGI server such as `uvicorn`. Lets install it:

```bash
$ pipenv install uvicorn
```

Now we can run our ASGI application using `uvicorn` with the following command:

```bash
$ pipenv run uvicorn websocket_app.asgi:application
INFO:     Started server process [25557]
INFO:     Waiting for application startup.
INFO:     ASGI 'lifespan' protocol appears unsupported.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

Open up a new tab in your browser, and open up the developer tools. In the console, create a new `Websocket` instance called `ws` pointed to `ws://localhost:8000/`. Then attach an `onmessage` handler that logs `event.data` to the console. Lastly, call `ws.send('ping')` to send the message to the server. You should see the value `"pong!"` logged to the console.

```javascript
> ws = new WebSocket('ws://localhost:8000/')
  WebSocket {url: "ws://localhost:8000/", readyState: 0, bufferedAmount: 0, onopen: null, onerror: null, …}
> ws.onmessage = event => console.log(event.data)
  event => console.log(event.data)
> ws.send("ping")
  undefined
  pong!
```

Congrats! You now know how to add Websocket support to your Django application using ASGI with zero extra dependencies. Now go build something awesome with it 😎

*👋 Hi, I'm Jayden. I love building apps and teaching others how to build apps. For more posts about building apps with Django, React, and GraphQL, follow me on [Twitter](windle.dev/tw) or subscribe to the newsletter below.*