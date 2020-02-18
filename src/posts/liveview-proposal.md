---
title: "Liveview: A Framework-Agnostic Approach to Building Server-Rendered Real-Time Apps"
date: 2020-02-13
excerpt: Exploring an emerging backend development approach
featuredImage: ../images/django-websockets-zero-dependencies.jpg
collection: posts
tags: ["LiveView", "Websockets"]
published: false 
---

## Server side

1) Server renders a LiveView component as static HTML, including the following attribtues:
    - `id`: a unique ID that matches a rendered component instance to it's  live component instance
    - `component`: a unique ID that specifies which component to has been rendered
    - `session`: signed session information, used to re-hydrate the component upon websocket connection
    - `content`: the rendered HTML of the component

    In practice, the HTML of a rendered LiveView component will look something like the following:

    ```html
    <div
        data-id="<unique_id>"
        data-component="some_package.SomeComponent"
        data-session="<signed session info>"
    >
        <p>Count: 0</p>
    </div>
    ```

2) Once the HTML has loaded in a user's browser, a websocket connection is opened with the LiveView server. Upon connection, the following steps are performed:
    - The server creates an instance of the LiveView `component`, passing in the `id` and `session` information from the client.
    - The server calls the `mount` method of the component instance

3) While the connection is open, the server does the following:
    - The server watches for any changes to the component instance's state that modify the `content` of the component. If any such changes occur, the updated `content` is rendered and sent to the client.
    - The server listens for any events sent from the client, and calls the appropriate handler method on the component instance. If the event modifies the state of the instance which causes a `content` change, the updated `content` is sent to the client
4) Upon disconnection, the server performs the following steps:
    - The server calls the `unmount` method of the component instance
    - The server destroys the component instance
    - The server removes any stored data that relates to the component instance associated with `id`

## Client side

1) The client loads a liveview enabled page. The page will include at least on rendered liveview component, and the LiveView javascript library. Upon page load, the LiveView javascript library does the following:
    - The LiveView library finds all elements on the page that are LiveView components
    - The library establishes a connection to the LiveView websocket endpoint on the backend.
    - The library sends a `subscribe` event to server via the websocket connection for each rendered LiveView component, passing up the `id`, `component`, and `session` data.
    - The library listens for any `update` events sent from the server. Each `update` event will contain the `id` of the component that was updated, as well as a representation of the updated `content` of the component.
    - Upon receiving an `update` event, the library applies the updated HTML `content` to the body of the rendered LiveView component
    - If at any point the connection to the liveview websocket endpoint is interrupted, the library will attempt to re-establish a connection. Upon re-connection the client will re-subscribe by resending the `subscribe` event.

## Interaction events

