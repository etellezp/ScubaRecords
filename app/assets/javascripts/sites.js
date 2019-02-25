$( document ).ready(function() {
  siteClickEvents();
});

const siteClickEvents = () => {
  $("a.js-sites-button").on("click", (e) => {
    e.preventDefault()
    fetch(`/sites.json`)
      .then(res => res.json())
      .then(data => {
        $(".js-load-sites").html('')
        data.forEach(site => {
          let newSite = new Site(site)
          let siteHtml = newSite.formatSiteIndex()
          $(".js-load-sites").append(siteHtml)
        })
      })
  })

  $(document).on("click", ".js-site-link", function(e) {
    e.preventDefault()
    $(".js-load-site-show").html('')
    let siteId = $(this).attr('data-id')
    fetch(`/sites/${siteId}.json`)
      .then(res => res.json())
      .then(data => {
        let newSite = new Site(data)
        let siteHtml = newSite.formatSiteShow()
        $(".js-load-site-show").append(siteHtml)
      })
  })

  $(document).on("click", ".js-next-site", function(e) {
    e.preventDefault()
    $(".js-load-site-show").html('')
    let siteId = $(this).attr('data-id')
    fetch(`/sites/${siteId}/next.json`)
      .then(res => res.json())
      .then(data => {
        let newSite = new Site(data)
        let siteHtml = newSite.formatSiteShow()
        $(".js-load-site-show").append(siteHtml)
      })
  })

  $(document).on("click", ".js-site-form-btn", function(e) {
    e.preventDefault()
    let url = this.attributes.href.textContent
    $.get(url).done(res => {
      $(".js-site-new-form").html(res)
      $("#new_site").on("submit", function(e) {
        e.preventDefault()
        $.ajax({
          method: 'POST',
          url: this.action,
          data: $(this).serialize(),
          success: response => {
            let newSite = new Site(response)
            let newSiteHtml = newSite.formatUserSites()
            $(".js-user-sites").append(newSiteHtml)
          }
        })
      })
    })
  })

}

class Site {
  constructor(obj) {
    this.id = site.id
    this.name = site.name
    this.location = site.location
    this.records = site.records
  }
}

// function Site(site) {
//   this.id = site.id
//   this.name = site.name
//   this.location = site.location
//   this.records = site.records
// }

Site.prototype.formatSiteIndex = function() {
  let siteHtml = `
    <ul>
      <li>Name: <a href="/sites/${this.id}" data-id="${this.id}" class="js-site-link"><strong>${this.name}</strong></a></li>
      <li>Location: <strong>${this.location}</strong></li>
    </ul>
    <hr>
  `
  return siteHtml
}

Site.prototype.formatSiteShow = function() {
  let siteHtml = `
    <h3>Name: <strong><em>${this.name}</em></strong></h3>
    <h4>Location: <strong><em>${this.location}</em></strong></h4>
    <button data-id="${this.id}" class="btn btn-primary btn-sm js-next-site">Next Site</button>
    <button data-id="${this.id}" class="btn btn-info btn-sm js-site-records-btn" data-id="${this.id}">Check Records</button>
    <a class="btn btn-outline-primary btn-sm js-add-new-record-btn" href="/sites/${this.id}/records/new">Add a New Record</a>
    <div class="js-site-records">

    </div>
  `
  return siteHtml
}

Site.prototype.formatUserSites = function() {
  let siteHtml = `
    <ul>
      <li>Name: <a href="/sites/${this.id}" data-id="${this.id}" class="js-site-link"><strong>${this.name}</strong></a></li>
      <li>Location: <strong>${this.location}</strong></li>
    </ul>
    <hr>
  `
  return siteHtml
}
