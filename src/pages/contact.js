import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

function ContactPage() {
  return (
    <Layout>
      <SEO
        title="Contact | Jayden Windle"
        description="I'm excited to hear from you! The best way to reach me is via twitter DM, but if you prefer email you can send me a message here."
        keywords={[`contact`, `Jayden Windle`, `software`, `software engineer`]}
      />
      <section>
        <form
          className="mx-auto md:w-3/4"
          name="Contact Form"
          method="POST"
          data-netlify="true"
        >
          <input type="hidden" name="form-name" value="Contact Form" />
          <p className="text-center mb-16">
            I'm excited to hear from you! The best way to reach me is via{" "}
            <a
              href="https://twitter.com/messages/compose?recipient_id=496469941"
              className="text-blue-600 underline"
            >
              twitter DM
            </a>
            , but if you prefer email you can send me a message here.
          </p>
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
