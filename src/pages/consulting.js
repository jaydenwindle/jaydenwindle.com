import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

function ContactPage() {
  return (
    <Layout>
      <SEO
        title="Contact"
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
      />
      <section>
        <form
          className="mx-auto md:w-3/4"
          name="contact"
          method="POST"
          data-netlify="true"
        >
          <label
            className="block font-bold mb-2 text-xs uppercase"
            htmlFor="name"
          >
            Name
          </label>

          <input
            className="appearance-none rounded block bg-gray-200 mb-6 px-3 py-2 rounded-md text-gray-700 w-full"
            name="name"
            id="name"
            type="text"
            placeholder="Joe Blow"
          />

          <label
            className="block font-bold mb-2 text-xs uppercase"
            htmlFor="email"
          >
            Email
          </label>

          <input
            className="appearance-none rounded block bg-gray-200 mb-6 px-3 py-2 rounded-md text-gray-700 w-full"
            id="email"
            name="email"
            type="email"
            placeholder="joeblow@gmail.com"
          />

          <label
            className="block font-bold mb-2 text-xs uppercase"
            htmlFor="message"
          >
            Message
          </label>

          <textarea
            className="appearance-none rounded block bg-gray-200 mb-6 px-3 py-2 rounded-md text-gray-700 w-full"
            id="message"
            name="message"
            placeholder="Say something..."
            rows="6"
          />

          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded text-sm">
            Send
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default ContactPage;
