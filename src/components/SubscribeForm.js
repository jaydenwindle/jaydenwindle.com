import React, { useState } from "react";

function SubscribeForm() {
  const [formShown, setFormShown] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.target);

    await fetch(
      "https://buttondown.email/api/emails/embed-subscribe/jaydenwindle",
      {
        method: "POST",
        body: data
      }
    );

    setFormShown(false);
    setLoading(false);
  }

  return (
    <section>
      <div className="rounded overflow-hidden border-blue-400 bg-blue-100 border-2 border-solid">
        <div className="px-6 py-12 text-center">
          <div className="font-bold text-xl mb-4">
            Get notified when I release new projects or blog posts!
          </div>
          <p className="text-gray-700 text-base"></p>
          <div className="flex flex-wrap -mx-3  justify-center">
            <div className="w-2/3 px-3">
              <form
                onSubmit={handleSubmit}
                className="embeddable-buttondown-form"
              >
                <div className="flex flex-col mb-4 md:flex-row">
                  {formShown ? (
                    <>
                      <input
                        className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2 md:mb-0"
                        type="email"
                        name="email"
                        placeholder="you@gmail.com"
                      />
                      <input type="hidden" value="1" name="embed" />
                      <button
                        disabled={loading}
                        type="submit"
                        value="Subscribe"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded md:ml-2"
                      >
                        {loading ? "Subscribing..." : "Subscribe"}
                      </button>
                    </>
                  ) : (
                    <p className="mx-auto text-center my-4">
                      Thanks for subscribing! Chat soon :)
                    </p>
                  )}
                </div>
              </form>
              <p className="text-gray-600 text-xs italic">
                No spam, no sketchy stuff. Just personal, hand-written emails :)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SubscribeForm;
