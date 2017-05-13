---
layout: page 
title: "Contact Me"
subtitle: "I love meeting new people. Feel free to send me a message any time!"
---

<form action="https://formspree.io/{{site.email}}" method="POST">
    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label for="name">Your Name</label>
                <input id="name" type="text" name="name" class="form-control" placeholder="Joe Blow">
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label for="email">Your Email</label>
                <input id="email" type="email" name="email" class="form-control" placeholder="joeblow@awesomecompany.com">
            </div>
        </div>
    </div>

    <div class="form-group">
        <label for="message">Your Message</label>
        <textarea id="message" name="message" class="form-control" cols="30" rows="10" placeholder="Hey, you seem super cool! Let's chat sometime."></textarea>
    </div>
    <br>
    <button class="btn btn-primary btn-block">Send</button>
</form>

