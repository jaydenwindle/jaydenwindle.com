---
title: How to Build a Portfolio Website Using Gatsby and Tailwind
date: 2019-09-22
excerpt: I try to re-build my personal website once per year, and each time I use it as an opportunity to learn something new. This year I...
featuredImage: ../images/hello-world.jpeg
collection: posts
---

## Steps:

### Initialize with tailwind starter
```bash
$ gatsby new my-new-website https://github.com/taylorbryant/gatsby-starter-tailwind
```

### Adding hero + contact information

```html
<section className="text-left mb-24">
    <h2 className="text-5xl font-bold inline-block my-8 lg:w-2/3">
        Hello World! <br /> I'm Jayden Windle.
    </h2>

    <p className="text-xl lg:w-2/3 mb-8">
        {data.site.siteMetadata.description}
    </p>
    <div>
        <a
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mb-1 hover:bg-gray-300 transition font-bold no-underline mr-4"
            href={data.site.siteMetadata.twitter}
        >
            Twitter
        </a>
        <a
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mb-1 hover:bg-gray-300 transition font-bold no-underline mr-4"
            href={data.site.siteMetadata.github}
        >
            Github
        </a>
        <a
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mb-1 hover:bg-gray-300 transition font-bold no-underline mr-4"
            href={data.site.siteMetadata.linkedin}
        >
            Linkedin
        </a>
    </div>
</section>

```

### Add post filesystem source

### Generate post pages

### Render posts

### Same process for projects

### Adding newsletter signup

### Deploying with Netlify
