---
---

$(function() {
    // typing effect in header
    Typed.new('#typed', {
        strings: ["a software developer at {{site.current_company}}", "a Comp Sci major at Carleton University", "a coffee aficionado", "a huge MacGyver fan (the 80s version, obviously)", "an avid hackathoner (is that a word?)", "lovin' life in Ottawa ✌", "a vim ninja", "very proud of my laptop sticker collection"],
        typeSpeed: 50,
        backDelay: 3000,
        loop: true,
    });

    var projects_app = new Vue({
        el: "#projects",
        data: {},
    })

    $("#menu-modal").height(window.innerHeight)

    $(".menu-toggle").click(() => {
        $("#menu-modal").height(window.innerHeight)

        $("#menu-modal").modal("toggle");

        if ($('.menu-toggle i').hasClass("fa-bars")) {
            $('.menu-toggle i').removeClass("fa-bars")
            $('.menu-toggle i').addClass("fa-times")
        } else {
            $('.menu-toggle i').removeClass("fa-times")
            $('.menu-toggle i').addClass("fa-bars")
        }
    });

});

{% raw %}
Vue.component('gh-info', {
    props: ['repo'],
    template: `
        <div class="row git-info">
            <div class="col-xs-4">
                <p class="small">Stars</p>
                <i class="fa fa-star"></i>
                <span class="git-stars">{{ stargazers_count }}</span>
            </div>
            <div class="col-xs-4">
                <p class="small">Watching</p>
                <i class="fa fa-eye"></i>
                <span class="git-watchers">{{ watchers_count }}</span>
            </div>
            <div class="col-xs-4">
                <p class="small">Commits</p>
                <i class="fa fa-history"></i>
                <span class="git-commits">{{ commits_count }}</span>
            </div>
        </div>
    `,
    data() {
        return {
            repo: '',
            description: '',
            stargazers_count: 0,
            watchers_count: 0,
            commits_count: 0,
        }
    },
    created() {
        getRepoInfo(this.repo)
            .then((ghData) => {
                console.log(ghData);
                this.description = ghData.description
                this.stargazers_count = ghData.stargazers_count
                this.watchers_count = ghData.watchers_count
                this.commits_count = ghData.commits_count
            });
    },
})
{% endraw %}

function getRepoInfo(repo) {
    var ghAPI = "https://api.github.com/"
    var repoURL = ghAPI + "repos/" + repo;

    // get most git info
    var mainPromise = $.ajax({
        url: repoURL,
        dataType: "json",
        beforeSend(xhr) {
            if (cachedData = getCachedGitData(repo)) {
                xhr.setRequestHeader("If-Modified-Since", new Date(cachedData.date).toUTCString())
            }
        }
    })

    // get number of commits
    var commitPromise = $.ajax({
        url: repoURL + "/contributors",
        dataType: "json",
        beforeSend(xhr) {
            if (cachedData = getCachedGitData(repo)) {
                xhr.setRequestHeader("If-Modified-Since", new Date(cachedData.date).toUTCString())
            }
        }
    })

    var p = new Promise(function (res, rej) {
        mainPromise
            .done((data, code, xhr) => {

                // cache data if new
                if (code !== "notmodified") {
                    console.log("loading fresh");
                    cacheGitData(repo, {
                        date: new Date(), 
                        description: data.description,
                        stargazers_count: data.stargazers_count,
                        watchers_count: data.watchers_count,
                    });
                }

            })
            .then(() => {
                return commitPromise
            })
            .done((data, code, xhr) => {
                var numCommits = 0;

                if (code !== "notmodified") {
                    console.log("loading fresh");
                    for (var i = 0; i < data.length; i++) {
                        numCommits += data[i].contributions
                    }
                    cacheGitData(repo, {
                        commits_count: numCommits
                    });
                }
            })
            .then(() => res(getCachedGitData(repo)))
    })

    return p
}

function cacheGitData(repo, data) {
    var cachedData = getCachedGitData(repo);

    for (key in data) {
        cachedData[key] = data[key]
    }

    localStorage[repo] = JSON.stringify(cachedData)
}

function getCachedGitData(repo) {
    return localStorage[repo] ? JSON.parse(localStorage[repo]) : {}
}
