---
---

$(function() {
    // typing effect in header
    Typed.new('#typed', {
        strings: ["a software developer", "an entrepreneur", "a coffee aficionado", "an avid hackathoner (is that a word?)", "lovin' life in Ottawa ✌", "a vim ninja", "a proud laptop sticker collector"],
        typeSpeed: 50,
        backDelay: 3000,
        loop: true
    });

});

{% raw %}
Vue.component('gh-card', {
    props: ['repo', 'name', 'image', 'url'],
    template: `
        <div class="col-md-4">
            <div class="thumbnail project-card">
                <img class="img-responsive" :src="image" alt="">
                <div class="caption">
                    <h4>{{ name }}</h4>
                    <p class="description">{{ description }}</p>
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
                    <a href="{{ url }}" class="btn btn-primary btn-block btn-rounded" role="button">
                        Details
                    </a> 
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            repo: '',
            name: '',
            image: '',
            url: '',
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
            })
    }
})
{% endraw %}

var projects_app = new Vue({
    el: "#projects",
    data: {} 
})

function getRepoInfo(repo) {
    var ghAPI = "https://api.github.com/"
    var repoURL = ghAPI + "repos/" + repo;

    // get most git info
    var mainPromise = $.ajax({
        url: repoURL,
        dataType: "json",
        beforeSend(xhr) {
            if (cachedData = getCachedGitData(repo)) {
                xhr.setRequestHeader("If-None-Match", cachedData.etag)
            }
        }
    })

    // get number of commits
    var commitPromise = $.ajax({
        url: repoURL + "/contributors",
        dataType: "json",
        beforeSend(xhr) {
            if (cachedData = getCachedGitData(repo)) {
                console.log(cachedData.etag);
                xhr.setRequestHeader("If-None-Match", cachedData.etag)
            }
        }
    })

    var p = new Promise(function (res, rej) {
        mainPromise
            .done((data, code, xhr) => {

                // cache data if new
                if (code !== "notmodified") {
                    console.log("loading fresh data");
                    cacheGitData(repo, {
                        etag: xhr.getResponseHeader("ETag"), 
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

                console.log(code !== "notmodified");

                if (code !== "notmodified") {
                    console.log("loading fresh data");
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
